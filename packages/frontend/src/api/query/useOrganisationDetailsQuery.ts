import { useQuery } from '@tanstack/react-query';
import {
  OrgStatusEnumValue,
  UserRoleEnumValue,
} from '@backend/src/schemas/enums';
import { TaskColorPaletteEnum } from '@backend/src/schemas/userSchema';
import { OrgListOfNonWorkingDaysEnum } from '@backend/src/schemas/organisationSchema';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import { QUERY_KEYS } from './querykeys';
import { requestURLs } from '@/Environment';

export type UserOrganisationType = {
  userOrganisationId: string;
  jobTitle?: string;
  role?: keyof typeof UserRoleEnumValue;
  taskColour?: TaskColorPaletteEnum;
  user: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarImg?: string;
  };
};

export type OrganisationResponseType = ResponseType<{
  organisationId: string;
  organisationName: string;
  industry: string;
  status: keyof typeof OrgStatusEnumValue;
  country: string;
  nonWorkingDays: OrgListOfNonWorkingDaysEnum[];
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  createdBy: string;
  userOrganisation: UserOrganisationType[];
}>;

function useOrganisationDetailsQuery(organisationId: string) {
  return useQuery<
    AxiosResponseAndError<OrganisationResponseType>['response'],
    AxiosResponseAndError<OrganisationResponseType>['error']
  >({
    queryFn: async () =>
      await ApiRequest.get(`${requestURLs.organisation}/${organisationId}`),
    queryKey: [QUERY_KEYS.organisation, organisationId],
  });
}

export default useOrganisationDetailsQuery;
