import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import { useForm } from "../../../hooks/form";
import { str } from "../../../validation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);

export function SignIn() {
  const classes = useStyles();

  const { handleSubmit, fields } = useForm(
    {
      password: str.is().and(str.nonempty().withMessage("is empty lol")),
      username: str.is().and(str.nonempty()),
      confirm: (val, rules, values) =>
        rules.password.and(
          str
            .equals(values.password)
            .withMessage("confirm and password does not match")
        ),
    },
    {
      onSubmit: (values) => {
        console.log("FORM SUBMIT EVENT", values.password);
      },
      onError: (errors) => {
        console.log("errros", errors);
      },
      checkSubmitOnly: true,
    }
  );

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField {...fields.username} label="Username" variant="filled" />
      <TextField
        {...fields.password}
        type="password"
        label="Password"
        variant="filled"
      />
      <TextField
        {...fields.confirm}
        type="password"
        name="confirm"
        label="Outlined"
        variant="filled"
      />
      <Button type="submit" color="primary" variant="contained">
        Submit
      </Button>
    </form>
  );
}
