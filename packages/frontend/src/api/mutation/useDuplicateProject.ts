import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { AxiosResponseAndError,ResponseType } from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type ProjectDuplicateResponseType = ResponseType<null>;
function useProjectDuplicateMutation() {

  const mutation = useMutation<
    AxiosResponseAndError<ProjectDuplicateResponseType>["response"],
    AxiosResponseAndError<ProjectDuplicateResponseType>["error"],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.put<ProjectDuplicateResponseType>(
        `${requestURLs.project}/duplicate-project/${data}`,
        data
      ),
  });

  return mutation;
}
export default useProjectDuplicateMutation;
