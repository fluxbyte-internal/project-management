import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { Comment } from "./useTaskAddCommentMutation";


type TaskCreateCommentResponseType = ResponseType<Comment>;

function useRemoveTaskCommentMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskCreateCommentResponseType>["response"],
    AxiosResponseAndError<TaskCreateCommentResponseType>["error"],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<TaskCreateCommentResponseType>(
        `${requestURLs.task}/comment/${data}`
      ),
  });

  return mutation;
}

export default useRemoveTaskCommentMutation;
