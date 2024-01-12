import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { createKanbanSchema } from "@backend/src/schemas/projectSchema";

export type KanbanColumnType = {
    name: string;
    percentage: number | null;
    projectId: string;
    createdByUserId: string;
    updatedByUserId: string | null;
    createdAt: Date;
    updatedAt: Date;
    kanbanColumnId: string;
}
type KanbanColumnApiResponse = ResponseType<KanbanColumnType>;

function useKanbanColumnMutation(projectId:string|undefined) {
  const mutation = useMutation<
    AxiosResponseAndError<KanbanColumnApiResponse>["response"],
    AxiosResponseAndError<KanbanColumnApiResponse>["error"],
    z.infer<typeof createKanbanSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<KanbanColumnApiResponse>(requestURLs.kanbanColumn+projectId, data),
  });

  return mutation;
}

export default useKanbanColumnMutation;
