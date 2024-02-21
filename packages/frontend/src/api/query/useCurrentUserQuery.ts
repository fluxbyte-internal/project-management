import { AxiosResponseAndError, ResponseType } from "../types/axiosResponseType";
import { QUERY_KEYS } from "./querykeys";
import ApiRequest from "../ApiRequest";
import { requestURLs } from "@/Environment";
import { useQuery } from "@tanstack/react-query";
import {UserRoleEnumValue} from '@backend/src/schemas/enums';
import { OrganisationType } from "../mutation/useOrganisationMutation";

export type UserType = {
  userId: string;
  email: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  timezone: string | null;
  country: string | null;
  avatarImg: string | null;
  isVerified:boolean
  createdAt: string;
  updatedAt: string;
  userOrganisation: UserOrganisationType[];
  provider?:Provider[];
  deletedAt?:string

};

export type UserOrganisationType = {
  userOrganisationId: string;
  userId: string;
  organisationId: string;
  role: keyof typeof UserRoleEnumValue;
  jobTitle: null;
  taskColour: null;
  createdAt: Date;
  updatedAt: Date;
  organisation:OrganisationType
};

export interface Provider {

  providerType?: string
}

export type UserResponseType = ResponseType<UserType>;

function useCurrentUserQuery() {
  return useQuery<
    AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"]
  >({
    queryKey: [QUERY_KEYS.currentUser],
    queryFn: async () => await ApiRequest.get(requestURLs.me),
    enabled: false,
    retry:0,
  });
}

export default useCurrentUserQuery;
