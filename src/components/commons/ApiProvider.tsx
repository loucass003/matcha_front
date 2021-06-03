import { ReactNode } from "react";
import { RestfulProvider } from "restful-react";
import { useSession } from "../../hooks/session";

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const { session, isLoggedIn, refreshToken } = useSession();

  return (
    <RestfulProvider
      base="http://localhost:4000"
      requestOptions={() =>
        isLoggedIn
          ? {
              headers: { Authorization: `Bearer ${session.token}` },
            }
          : {}
      }
      onResponse={({ headers }) => {
        const authorization = headers.get("Authorization");
        if (authorization) {
          refreshToken(authorization.substring("Bearer ".length));
        }
      }}
    >
      {children}
    </RestfulProvider>
  );
}
