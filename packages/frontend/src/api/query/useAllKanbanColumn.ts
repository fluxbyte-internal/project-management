import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "./querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { KanbanColumnType } from "../mutation/useKanbanCreateColumn";


type KanbanColumnResponse = ResponseType<KanbanColumnType[]>;

function useAllKanbanColumnQuery(projectId:string|undefined) {
  return useQuery<
    AxiosResponseAndError<KanbanColumnResponse>["response"],
    AxiosResponseAndError<KanbanColumnResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.allKanbanColumn],
    queryFn: async () =>
      await ApiRequest.get(requestURLs.kanbanColumn+projectId, {
        headers: { "organisation-id": localStorage.getItem("organisation-id") },
      }),
    enabled: true,
    refetchOnMount : false,
  });
}

export default useAllKanbanColumnQuery;
