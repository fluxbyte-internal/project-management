import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { createCommentTaskSchema } from "@backend/src/schemas/taskSchema";
import ApiRequest from "../ApiRequest";

export type Comment = {
  commentId: string;
  taskId: string;
  commentText: string;
  commentByUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

type TaskCreateCommentResponseType = ResponseType<Comment>;

function useCreateTaskCommentMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskCreateCommentResponseType>["response"],
    AxiosResponseAndError<TaskCreateCommentResponseType>["error"],
    z.infer<typeof createCommentTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskCreateCommentResponseType>(
        `${requestURLs.task}/comment/${taskId}`,
        data
      ),
  });

  return mutation;
}

export default useCreateTaskCommentMutation;
