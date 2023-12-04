import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import type { forgotPasswordSchema } from "backend/src/schemas/authSchema";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import axios from "axios";
export type ForgotEmailSend = ResponseType<null>;

function useForgotPassword() {
  const mutation = useMutation<
    AxiosResponseAndError<ForgotEmailSend>["response"],
    AxiosResponseAndError<ForgotEmailSend>["error"],
    z.infer<typeof forgotPasswordSchema>
  >({
    mutationFn: (data) =>
      axios.post<ForgotEmailSend>(requestURLs.ForgotPassword, data),
  });

  return mutation;
}
export default useForgotPassword;