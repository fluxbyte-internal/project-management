import { UserResponseType } from "@/hooks/useUser";
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

export type UserResponseType = ResponseType<UserType>;

function useCurrentUserQuery() {
  return useQuery<
    AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"]
  >({
    queryKey: [QUERY_KEYS.currentUser],
    queryFn: async () => {
      const response = await ApiRequest.get(requestURLs.me);

      if (response.data) {
        localStorage.setItem(
          "organisation-id",
          response.data.data.userOrganisation[0].organisation.organisationId
        );
      }

      return response;
    },
    enabled: false,
  });
}

export default useCurrentUserQuery;
