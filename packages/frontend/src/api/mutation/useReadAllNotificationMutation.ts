import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { AxiosResponseAndError } from "@/api/types/axiosResponseType";
import { UserResponseType } from "../query/useCurrentUserQuery";
import ApiRequest from "../ApiRequest";
import { NotificationType } from "../query/useAllNotificationQuery";

function useReadAllNotificationMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"],
    NotificationType
  
  >({
    mutationFn: (data) =>
      ApiRequest.put<UserResponseType>(requestURLs.notification, data),
  });

  return mutation;
}
export default useReadAllNotificationMutation;