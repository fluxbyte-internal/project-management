import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type TaskRemoveDependenciesResponseType = ResponseType<null>;

function useRemoveTaskDependenciesMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskRemoveDependenciesResponseType>["response"],
    AxiosResponseAndError<TaskRemoveDependenciesResponseType>["error"],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<TaskRemoveDependenciesResponseType>(
        `${requestURLs.task}dependencies/${data}`
      ),
  });

  return mutation;
}

export default useRemoveTaskDependenciesMutation;
