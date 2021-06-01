import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePasswordReset } from "../../../api/auth/password-reset";
import {
  emailRules,
  passwordRules,
} from "../../../commons/types/auth/password-reset";
import { str } from "../../../commons/validation";
import { useAlert } from "../../../hooks/alert";
import { useForm } from "../../../hooks/form";
import { useSession } from "../../../hooks/session";
import { AppAlert } from "../../commons/AppAlert";
import { FormFieldDetails } from "../../commons/FormFieldDetails";

interface ResetPasswordParams {
  token: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);

function EmailForm() {
  const classes = useStyles();
  const { state: alert, error, success } = useAlert();
  const { mutate: reset } = usePasswordReset();
  const [form, setForm] = useState(true);

  const { handleSubmit, fields } = useForm(
    {
      email: emailRules,
    },
    {
      onSubmit: async ({ email }) => {
        try {
          await reset({ email });
          success("A Reset Password Confirmation mail has been send!", -1);
          setForm(false);
        } catch (e) {
          error(e.data.message);
        }
      },
    }
  );

  return (
    <div>
      <AppAlert state={alert} />
      {form && (
        <form className={classes.root} onSubmit={handleSubmit}>
          <TextField {...fields.email} label="Email" variant="filled" />
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export function ChangePasswordForm() {
  const classes = useStyles();
  const { state: alert, error } = useAlert();
  const { mutate: reset } = usePasswordReset();
  const { token } = useParams<ResetPasswordParams>();
  const { login } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, fields } = useForm(
    {
      password: passwordRules,
      confirm: (val, rules, values) =>
        rules.password.and(
          str
            .equals(values.password)
            .withMessage("confirm and password does not match")
        ),
    },
    {
      onSubmit: async ({ password }) => {
        try {
          const { token: authToken } = await reset({
            reset: { token, password },
          });
          login(authToken);
          enqueueSnackbar("Your password has been changed", {
            variant: "success",
          });
        } catch (e) {
          error(e.data.message);
        }
      },
    }
  );

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <AppAlert state={alert} />
      <TextField
        {...fields.password}
        type="password"
        label="Password"
        helperText={<FormFieldDetails field={fields.password} />}
        variant="filled"
      />
      <TextField
        {...fields.confirm}
        type="password"
        label="Confirm Password"
        variant="filled"
      />
      <Button type="submit" color="primary" variant="contained">
        Submit
      </Button>
    </form>
  );
}

export function ResetPassword() {
  const { token } = useParams<ResetPasswordParams>();

  return token ? <ChangePasswordForm /> : <EmailForm />;
}
