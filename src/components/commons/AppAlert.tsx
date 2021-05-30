import { Alert } from "@material-ui/lab";
import { AlertState } from "../../hooks/alert";

interface AppAlertProps {
  state: AlertState;
}

export function AppAlert({ state }: AppAlertProps) {
  return (
    <div>
      {state.alerts.map(({ id, variant, severity, content }) => (
        <Alert key={id} variant={variant} severity={severity}>
          {content}
        </Alert>
      ))}
    </div>
  );
}
