import { useMutate } from "restful-react";
import {
  IPasswordResetPost,
  IPasswordResetResponse,
} from "../../commons/types/auth/password-reset";
import { IResponseError } from "../../commons/types/errors/ResponseError";

export function usePasswordReset() {
  return useMutate<
    IPasswordResetResponse,
    IResponseError,
    never,
    IPasswordResetPost
  >({
    verb: "POST",
    path: `/auth/password-reset`,
  });
}
