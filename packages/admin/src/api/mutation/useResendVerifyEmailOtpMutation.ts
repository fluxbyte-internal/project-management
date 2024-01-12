import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

export type VerifyEmailResponse = ResponseType<null>;

function useResendVerifyEmailOtpMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<VerifyEmailResponse>["response"],
    AxiosResponseAndError<VerifyEmailResponse>["error"],
    null
  >({
    mutationFn: () =>
      ApiRequest.post<VerifyEmailResponse>(requestURLs.resendVerifyEmailOtp),
  });

  return mutation;
}

export default useResendVerifyEmailOtpMutation;
