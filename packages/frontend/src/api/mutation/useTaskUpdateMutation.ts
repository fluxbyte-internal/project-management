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
    z.infer<typeof updateTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<UpdateTaskResponseType>(requestURLs.task + taskId, data),
  });

  return mutation;
}

export default useUpdateTaskMutation;
