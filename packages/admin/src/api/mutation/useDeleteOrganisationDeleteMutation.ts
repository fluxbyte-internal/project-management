import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type TaskRemoveDependenciesResponseType = ResponseType<null>;

function useDeleteOrganisationMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskRemoveDependenciesResponseType>["response"],
    AxiosResponseAndError<TaskRemoveDependenciesResponseType>["error"],
    string
  >({
    mutationFn: (organisationId) =>
      ApiRequest.delete<TaskRemoveDependenciesResponseType>(
        requestURLs.organisation + "/" + organisationId
      ),
  });

  return mutation;
}

export default useDeleteOrganisationMutation;
