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
    z.infer<typeof updateTaskSchema> & { taskId?: string }
  >({
    mutationFn: (data) => {
      const id = data.taskId ? data.taskId : taskId;
      return ApiRequest.put<UpdateTaskResponseType>(
        requestURLs.task + id,
        data
      );
    },
  });

  return mutation;
}

export default useUpdateTaskMutation;
