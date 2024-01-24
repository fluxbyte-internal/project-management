import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { createCommentTaskSchema } from "@backend/src/schemas/taskSchema";
import ApiRequest from "../ApiRequest";
import { Comment } from "./useTaskAddCommentMutation";


type TaskCreateCommentResponseType = ResponseType<Comment>;

function useUpdateTaskCommentMutation(commentId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskCreateCommentResponseType>["response"],
    AxiosResponseAndError<TaskCreateCommentResponseType>["error"],
    z.infer<typeof createCommentTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<TaskCreateCommentResponseType>(
        `${requestURLs.task}/comment/${commentId}`,
        data
      ),
  });

  return mutation;
}

export default useUpdateTaskCommentMutation;
