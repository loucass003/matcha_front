import { ReactNode } from "react";
import { SessionContext, useProvideSession } from "../../hooks/session";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const session = useProvideSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
