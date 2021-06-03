import { Fade } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { AlertState } from "../../hooks/alert";

interface AppAlertProps {
  state: AlertState;
}

export function AppAlert({ state }: AppAlertProps) {
  return (
    <div>
      {state.alerts.map(({ id, variant, severity, content }) => (
        <Fade key={id} in>
          <Alert variant={variant} severity={severity}>
            {content}
          </Alert>
        </Fade>
      ))}
    </div>
  );
}
