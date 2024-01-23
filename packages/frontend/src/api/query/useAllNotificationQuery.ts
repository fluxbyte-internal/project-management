import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "./querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import ApiRequest from "../ApiRequest";


type NotificationResponse = ResponseType<[]>;

function useAllNotificationQuery() {
  return useQuery<
    AxiosResponseAndError<NotificationResponse>["response"],
    AxiosResponseAndError<NotificationResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.allNotification],
    queryFn: async () =>
      await ApiRequest.get(requestURLs.notification),
    enabled: true,
  });
}

export default useAllNotificationQuery;