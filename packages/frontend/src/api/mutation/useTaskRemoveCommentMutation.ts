import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { Comment } from "./useTaskAddCommentMutation";


type TaskRemoveCommentResponseType = ResponseType<Comment>;

function useRemoveTaskCommentMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskRemoveCommentResponseType>["response"],
    AxiosResponseAndError<TaskRemoveCommentResponseType>["error"],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<TaskRemoveCommentResponseType>(
        `${requestURLs.task}comment/${data}`
      ),
  });

  return mutation;
}

export default useRemoveTaskCommentMutation;
