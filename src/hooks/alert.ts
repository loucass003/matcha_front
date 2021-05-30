import { Color } from "@material-ui/lab";
import { Reducer, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Alert {
  severity: Color;
  variant?: "standard" | "filled" | "outlined";
  content: React.ReactNode;
  id: string;
}

export interface AlertState {
  alerts: Alert[];
}

type AlertColorAction = { type: Color; message: string; id: string };

type AlertActions = AlertColorAction | { type: "remove"; id: string };

function reducer(state: AlertState, action: AlertActions): AlertState {
  switch (action.type) {
    case "success":
    case "info":
    case "warning":
    case "error": {
      return {
        ...state,
        alerts: [
          ...state.alerts,
          {
            severity: action.type,
            content: action.message,
            id: action.id,
          },
        ],
      };
    }
    case "remove": {
      return {
        ...state,
        alerts: state.alerts.filter(({ id }) => id !== action.id),
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
  }
}

export function useAlert() {
  const [state, dispatch] = useReducer<Reducer<AlertState, AlertActions>>(
    reducer,
    { alerts: [] }
  );

  const makeAlertColor = (color: Color) => {
    return (message: string, timeout = 10000) => {
      const id = uuidv4();
      dispatch({ type: color, message, id });
      setTimeout(() => {
        dispatch({ type: "remove", id });
      }, timeout);
    };
  };

  return {
    state,
    error: makeAlertColor("error"),
    info: makeAlertColor("info"),
    success: makeAlertColor("success"),
    warning: makeAlertColor("warning"),
  };
}
