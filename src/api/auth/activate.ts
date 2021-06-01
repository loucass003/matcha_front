import { useMutate } from "restful-react";
import { useSession } from "../../hooks/session";
import { IResponseError } from "../../commons/types/errors/ResponseError";
import {
  IActivatePost,
  IActivateResponse,
} from "../../commons/types/auth/activate";

export function useActivate() {
  const { login } = useSession();

  return useMutate<IActivateResponse, IResponseError, never, IActivatePost>({
    verb: "POST",
    path: `/auth/activate`,
    resolve: (data: IActivateResponse) => {
      login(data.token);
      return data;
    },
  });
}
