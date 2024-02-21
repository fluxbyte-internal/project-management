import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

export type ResendInvitationResponse = ResponseType<null>;

function useResendInvitationMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ResendInvitationResponse>["response"],
    AxiosResponseAndError<ResendInvitationResponse>["error"],
    {id:string}
  >({
    mutationFn: (data) =>
      ApiRequest.post<ResendInvitationResponse>(`${requestURLs.organisation+'/resend-invitation/'}${data.id}`),
  });

  return mutation;
}

export default useResendInvitationMutation;
