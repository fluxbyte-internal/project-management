import { useQuery } from '@tanstack/react-query';
import { UserRoleEnumValue } from '@backend/src/schemas/enums';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import ApiRequest from '../ApiRequest';
import { OrganisationType } from '../mutation/useOrganisationMutation';
import { QUERY_KEYS } from './querykeys';
import { requestURLs } from '@/Environment';

export type UserType = {
  userId: string;
  email: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  timezone: string | null;
  country: string | null;
  avatarImg: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userOrganisation: UserOrganisationType[];
  provider?: Provider;
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
  organisation: OrganisationType;
};

export interface Provider {
  providerType?: string;
}

export type UserResponseType = ResponseType<UserType>;

function useCurrentUserQuery() {
  return useQuery<
    AxiosResponseAndError<UserResponseType>['response'],
    AxiosResponseAndError<UserResponseType>['error']
  >({
    enabled: false,
    queryFn: async () => await ApiRequest.get(requestURLs.me),
    queryKey: [QUERY_KEYS.currentUser],
    retry: 0,
  });
}

export default useCurrentUserQuery;
