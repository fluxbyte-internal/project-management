import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "../../api/query/querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../../api/types/axiosResponseType";
import ApiRequest from "../../api/ApiRequest";

export interface OrganisationUserType {
  userOrganisationId: string
  userId: string
  organisationId: string
  role: string
  jobTitle?: string
  taskColour?: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface User {
  avatarImg: string
  email: string
  lastName: string
  firstName: string
  status: string
}
type OrganisationsMemberListApiResponse = ResponseType<OrganisationUserType[]>;

function useGetusersOrganisationsQuery(organisationId:string) {
  return useQuery<
    AxiosResponseAndError<OrganisationsMemberListApiResponse>["response"],
    AxiosResponseAndError<OrganisationsMemberListApiResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.organisation],
    queryFn: async () => await ApiRequest.get(`${requestURLs.organisation + "/" + organisationId}`),
    enabled: true,
  });
}

export default useGetusersOrganisationsQuery;
