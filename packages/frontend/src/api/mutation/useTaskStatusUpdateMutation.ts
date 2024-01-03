import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { taskStatusSchema } from "@backend/src/schemas/taskSchema";
import ApiRequest from "../ApiRequest";
import { Comment } from "./useTaskAddCommentMutation";

type TaskCreateCommentResponseType = ResponseType<Comment>;

function useTaskStatusUpdateMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskCreateCommentResponseType>["response"],
    AxiosResponseAndError<TaskCreateCommentResponseType>["error"],
    z.infer<typeof taskStatusSchema> & { taskId?: string }
  >({
    mutationFn: (data) => {
      return ApiRequest.put<TaskCreateCommentResponseType>(
        `${requestURLs.task}status/${data.taskId}`,
        data
      );
    },
  });

  return mutation;
}

export default useTaskStatusUpdateMutation;
