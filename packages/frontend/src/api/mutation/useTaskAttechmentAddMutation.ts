import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { Task } from "./useTaskCreateMutation";

type TaskAttechmentAddResponse = ResponseType<Task>;

function useTaskAttechmentAddMutation(taskId?:string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskAttechmentAddResponse>["response"],
    AxiosResponseAndError<TaskAttechmentAddResponse>["error"],
    FormData
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskAttechmentAddResponse>(
        `${requestURLs.task}attachment/${taskId}`,
        data
      ),
  });

  return mutation;
}

export default useTaskAttechmentAddMutation;
