import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useLogin } from "../../../api/auth/login";
import { IMutationError } from "../../../api/types";
import { useAlert } from "../../../hooks/alert";
import { useForm } from "../../../hooks/form";
import { useFallbackRouter } from "../../../router";
import { loginPostSchema } from "../../../types/auth/login";
import { IResponseError } from "../../../types/errors/ResponseError";
import { AppAlert } from "../../commons/AppAlert";

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

export function SignIn() {
  const classes = useStyles();
  const { mutate: login } = useLogin();
  const { state: alert, error } = useAlert();
  const history = useHistory();
  const { hasFallbackRoute, fallback } = useFallbackRouter();

  const { handleSubmit, fields } = useForm(loginPostSchema, {
    onSubmit: async ({ email, password }) => {
      try {
        await login({ email, password });
        if (hasFallbackRoute) fallback();
        else history.push("/");
      } catch (e) {
        const { data } = e as IMutationError<IResponseError>;
        error(data.message);
      }
    },
  });

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <AppAlert state={alert} />
      <TextField {...fields.email} label="Email" variant="filled" />
      <TextField
        {...fields.password}
        type="password"
        label="Password"
        variant="filled"
      />
      <Button type="submit" color="primary" variant="contained">
        Submit
      </Button>
    </form>
  );
}
