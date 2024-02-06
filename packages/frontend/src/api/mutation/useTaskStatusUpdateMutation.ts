import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { Comment } from "./useTaskAddCommentMutation";

type TaskCreateCommentResponseType = ResponseType<Comment>;

function useTaskStatusUpdateMutation(taskId: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskCreateCommentResponseType>["response"],
    AxiosResponseAndError<TaskCreateCommentResponseType>["error"],
    {status:string}
  >({
    mutationFn: (data) => {
      return ApiRequest.put<TaskCreateCommentResponseType>(
        `${requestURLs.task}status/${taskId}`,
        data
      );
    },
  });

  return mutation;
}

export default useTaskStatusUpdateMutation;
