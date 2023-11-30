import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios from "axios";
import { z } from "zod";
import { AxiosResponseAndError, ResponseType } from "@/api/types/axiosResponseType";
import { verifyEmailOtpSchema } from "@backend/src/schemas/authSchema";


export type VerifyEmailResponse = ResponseType<null>;

function useVerifyEmailMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<VerifyEmailResponse>["response"],
    AxiosResponseAndError<VerifyEmailResponse>["error"],
    z.infer<typeof verifyEmailOtpSchema>
  >({
    mutationFn: (data) => axios.post<VerifyEmailResponse>(requestURLs.verifyEmail, data),
  });

  return mutation;
}

export default useVerifyEmailMutation;
