import { useMutate } from "restful-react";
import { useSession } from "../../hooks/session";
import { ILoginPost, ILoginResponse } from "../../commons/types/auth/login";
import { IResponseError } from "../../commons/types/errors/ResponseError";

export function useLogin() {
  const { login } = useSession();

  return useMutate<ILoginResponse, IResponseError, never, ILoginPost>({
    verb: "POST",
    path: `/auth/login`,
    resolve: (data: ILoginResponse) => {
      login(data.token);
      return data;
    },
  });
}
