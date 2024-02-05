import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { NotificationType } from "../query/useAllNotificationQuery";

type SingleReadNotificationResponse = ResponseType<NotificationType>;

function useSingleReadNotificationMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<SingleReadNotificationResponse>["response"],
    AxiosResponseAndError<SingleReadNotificationResponse>["error"],
    NotificationType
  >({
    mutationFn: (data) => 
      ApiRequest.put<SingleReadNotificationResponse>(`${requestURLs.notification}/${data.notificationId}`,data),
  });

  return mutation;
}
export default useSingleReadNotificationMutation;