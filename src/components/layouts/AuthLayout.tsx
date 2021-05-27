import { ReactNode } from "react";
import { Navbar } from "../commons/Navbar";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
