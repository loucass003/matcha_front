import { createContext, Reducer, useContext, useReducer } from "react";
import jwt from "jsonwebtoken";
import { IUserSession } from "../commons/types/user";

export const SessionContext = createContext<Session>(undefined as any);

export type SessionActions =
  | { type: "login"; token: string }
  | { type: "logout" }
  | { type: "refresh_token"; token: string };

export interface ISessionState {
  user?: IUserSession;
  token?: string;
}

function login(token: string): ISessionState {
  const decoded = jwt.decode(token) as any;
  if (!decoded) {
    return {};
  }
  localStorage.setItem("MATCHA_AUTH_TOKEN", token);
  return {
    user: decoded.data as IUserSession,
    token,
  };
}

function authReducer(
  state: ISessionState,
  action: SessionActions
): ISessionState {
  switch (action.type) {
    case "refresh_token":
    case "login": {
      return {
        ...state,
        ...login(action.token),
      };
    }
    case "logout": {
      localStorage.removeItem("MATCHA_AUTH_TOKEN");
      return {
        ...state,
        user: undefined,
        token: undefined,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
  }
}

export interface Session {
  session: ISessionState;
  login: (token: string) => void;
  refreshToken: (token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

function init() {
  const token = localStorage.getItem("MATCHA_AUTH_TOKEN");
  if (token) {
    return {
      ...login(token),
    };
  }
  return {};
}

export function useProvideSession(): Session {
  const [state, dispatch] = useReducer<Reducer<ISessionState, SessionActions>>(
    authReducer,
    init()
  );

  return {
    session: state,
    login: (token) => dispatch({ type: "login", token }),
    logout: () => dispatch({ type: "logout" }),
    refreshToken: (token) => dispatch({ type: "refresh_token", token }),
    isLoggedIn: !!state.user,
  };
}

export function useSession(): Session {
  const context = useContext<Session>(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
