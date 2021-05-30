import { useSession } from "../../hooks/session";

export function Home() {
  const { session } = useSession();

  return <div>BONJOUR {session.user?.firstname}</div>;
}
