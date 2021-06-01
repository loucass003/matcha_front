import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useRegister } from "../../../api/auth/register";
import { IMutationError } from "../../../api/types";
import { useAlert } from "../../../hooks/alert";
import { useForm } from "../../../hooks/form";
import { registerPostSchema } from "../../../commons/types/auth/register";
import { IResponseError } from "../../../commons/types/errors/ResponseError";
import { str } from "../../../commons/validation";
import { AppAlert } from "../../commons/AppAlert";
import { FormFieldDetails } from "../../commons/FormFieldDetails";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      "& > *": {
        margin: theme.spacing(1),
        width: "50ch",
      },
    },
  })
);

export function SignUp() {
  const classes = useStyles();
  const { mutate: register, loading } = useRegister();
  const { state: alert, error } = useAlert();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, fields } = useForm(
    {
      ...registerPostSchema,
      confirm: (val, rules, values) =>
        rules.password.and(
          str
            .equals(values.password)
            .withMessage("confirm and password does not match")
        ),
    },
    {
      onSubmit: async ({ firstname, lastname, email, password }) => {
        try {
          await register({ firstname, lastname, email, password });
          history.push("/auth/sign-in");
          enqueueSnackbar("Your account has been created", {
            variant: "success",
          });
        } catch (e) {
          const { data } = e as IMutationError<IResponseError>;
          error(data.message);
        }
      },
    }
  );

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <AppAlert state={alert} />
      <TextField {...fields.firstname} label="Firstname" variant="filled" />
      <TextField {...fields.lastname} label="Lastname" variant="filled" />
      <TextField {...fields.email} label="Email" variant="filled" />
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
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={loading}
      >
        Submit
      </Button>
    </form>
  );
}
