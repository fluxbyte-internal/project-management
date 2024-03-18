import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type ProjectApiResponse = ResponseType<null>;
export type ProjectRoleType = {
    assingprojectId:string|undefined
    role:string|undefined
}

function useProjectMemberRoleMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectApiResponse>["response"],
    AxiosResponseAndError<ProjectApiResponse>["error"],
    ProjectRoleType
  >({
    mutationFn: (data) =>
      ApiRequest.put<ProjectApiResponse>(`${requestURLs.project}/projectAssgined/role-update/${data.assingprojectId}`, {role:data.role}, {
        headers: { "organisation-id": localStorage.getItem("organisation-id") },
      }),
  });

  return mutation;
}
export default useProjectMemberRoleMutation;