import {
  AppBar,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    endButtons: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

export function Navbar() {
  const classes = useStyles();

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Matcha
        </Typography>
        <div className={classes.endButtons}>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            to="/auth/sign-in"
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            to="/auth/sign-up"
          >
            Sign Up
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
