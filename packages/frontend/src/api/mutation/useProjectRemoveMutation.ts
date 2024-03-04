import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type ProjectRemoveResponseType = ResponseType<null>;

function useRemoveProjectMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectRemoveResponseType>["response"],
    AxiosResponseAndError<ProjectRemoveResponseType>["error"],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<ProjectRemoveResponseType>(
        `${requestURLs.project}/${data}`
      ),
  });

  return mutation;
}

export default useRemoveProjectMutation;
