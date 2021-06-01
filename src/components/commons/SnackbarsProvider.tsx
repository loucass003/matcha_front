import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";

interface SessionProviderProps {
  children: ReactNode;
}

export default function SnackbarsProvider({ children }: SessionProviderProps) {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
}
