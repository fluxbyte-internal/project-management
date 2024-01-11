import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { updateTaskSchema } from "@backend/src/schemas/taskSchema";
import ApiRequest from "../ApiRequest";
import { Task } from "./useTaskCreateMutation";

type UpdateTaskResponseType = ResponseType<Task>;

function useUpdateTaskMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<UpdateTaskResponseType>["response"],
    AxiosResponseAndError<UpdateTaskResponseType>["error"],
    z.infer<typeof updateTaskSchema> & {id:string}
  >({
    mutationFn: (data) =>
      ApiRequest.put<UpdateTaskResponseType>(requestURLs.task +data.id?? taskId, data),
  });

  return mutation;
}

export default useUpdateTaskMutation;
