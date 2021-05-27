import { ReactNode } from "react";
import { Navbar } from "../commons/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
