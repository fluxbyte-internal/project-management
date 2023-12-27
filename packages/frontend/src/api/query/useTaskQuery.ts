import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "./querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { Task } from "../mutation/useTaskCreateMutation";


type TaskResponse = ResponseType<Task>;

function useTaskQuery(taskId:string|undefined) {
  return useQuery<
    AxiosResponseAndError<TaskResponse>["response"],
    AxiosResponseAndError<TaskResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.taskById],
    queryFn: async () =>
      await ApiRequest.get(requestURLs.task+"byId/"+taskId, {
        headers: { "organisation-id": localStorage.getItem("organisation-id") },
      }),
    enabled: true,
  });
}

export default useTaskQuery;
