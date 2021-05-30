import { useMutate } from "restful-react";
import { IRegisterPost, IRegisterResponse } from "../../types/auth/register";
import { IResponseError } from "../../types/errors/ResponseError";

export function useRegister() {
  return useMutate<IRegisterResponse, IResponseError, never, IRegisterPost>({
    verb: "POST",
    path: `/auth/register`,
  });
}
