import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "../../api/query/querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../../api/types/axiosResponseType";
import ApiRequest from "../../api/ApiRequest";
<<<<<<< HEAD

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
=======
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
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d

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
