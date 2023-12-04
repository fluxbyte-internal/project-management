import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import type {  resetPasswordTokenSchema } from "backend/src/schemas/authSchema";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import axios from "axios";
export type ForgotEmailSend = ResponseType<null>;

function useResetPasswordMutation(token:string) {
  const mutation = useMutation<
    AxiosResponseAndError<ForgotEmailSend>["response"],
    AxiosResponseAndError<ForgotEmailSend>["error"],
    z.infer<typeof resetPasswordTokenSchema>
  >({
    mutationFn: (data) =>
      axios.put<ForgotEmailSend>(`${requestURLs.ResetPassword}/${token}`, data),
  });

  return mutation;
}
export default useResetPasswordMutation;