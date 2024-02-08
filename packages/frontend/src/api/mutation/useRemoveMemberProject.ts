import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type ProjectRemoveMemberResponseType = ResponseType<null>;

function useRemoveProjectMemberMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectRemoveMemberResponseType>["response"],
    AxiosResponseAndError<ProjectRemoveMemberResponseType>["error"],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<ProjectRemoveMemberResponseType>(
        `${requestURLs.project}/remove-assignee/${data}`
      ),
  });

  return mutation;
}

export default useRemoveProjectMemberMutation;
