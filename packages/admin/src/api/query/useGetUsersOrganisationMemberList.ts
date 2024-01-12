import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "../../api/query/querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../../api/types/axiosResponseType";
import ApiRequest from "../../api/ApiRequest";
import { OperatorStatusEnumValue, UserRoleEnumValue } from "@backend/src/schemas/enums";

export type organisationDataType = {
  avatarImg: null;
  createdAt: Date;
  email: string;
  firstName: string;
  isVerified: boolean;
  lastName: string;
  role: keyof typeof UserRoleEnumValue;
  status: keyof typeof OperatorStatusEnumValue;
  updatedAt: Date;
  userId: string;
};
export type OrganisationsListApiType = {
  userOrganisationId: string;
  jobTitle?: string;
  role?: keyof typeof UserRoleEnumValue;
  user: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarImg?: string;
  };
};
type OrganisationsMemberListApiResponse = ResponseType<any[]>;

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
