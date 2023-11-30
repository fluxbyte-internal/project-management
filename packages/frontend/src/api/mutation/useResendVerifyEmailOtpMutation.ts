import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios from "axios";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";

export type VerifyEmailResponse = ResponseType<null>;

function useResendVerifyEmailOtpMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<VerifyEmailResponse>["response"],
    AxiosResponseAndError<VerifyEmailResponse>["error"],
    null
  >({
    mutationFn: (data) =>
      axios.post<VerifyEmailResponse>(requestURLs.resendVerifyEmailOtp, data),
  });

  return mutation;
}

export default useResendVerifyEmailOtpMutation;
