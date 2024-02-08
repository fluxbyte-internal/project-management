import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "./querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { UserOrganisationType } from "./useOrganisationDetailsQuery";

type ProjectMemberListApiResponse = ResponseType<UserOrganisationType[]>;

function useProjectMemberListQuery() {
  return useQuery<
    AxiosResponseAndError<ProjectMemberListApiResponse>["response"],
    AxiosResponseAndError<ProjectMemberListApiResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.ProjectMember],
    queryFn: async () =>
      await ApiRequest.get(`${requestURLs.project}/org-users`, {
        headers: { "organisation-id": localStorage.getItem("organisation-id") },
      }),
    enabled: true,
  });
}

export default useProjectMemberListQuery;
