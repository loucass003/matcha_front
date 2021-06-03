import { useMutate } from "restful-react";
import {
  IRegisterPost,
  IRegisterResponse,
} from "../../commons/types/auth/register";
import { IResponseError } from "../../commons/types/errors/ResponseError";

export function useRegister() {
  return useMutate<IRegisterResponse, IResponseError, never, IRegisterPost>({
    verb: "POST",
    path: `/auth/register`,
  });
}
