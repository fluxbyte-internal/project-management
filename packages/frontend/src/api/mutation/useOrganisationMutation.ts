import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { OrgStatusEnumValue } from '@backend/src/schemas/enums';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import type {
  createOrganisationSchema,
  OrgListOfNonWorkingDaysEnum,
} from 'backend/src/schemas/organisationSchema';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

export type OrganisationType = {
  organisationId: string;
  organisationName: string;
  industry: string;
  status: keyof typeof OrgStatusEnumValue;
  country: string;
  nonWorkingDays: OrgListOfNonWorkingDaysEnum[];
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  createdByUserId: string;
  updatedByUserId?: string;
};
type OrganisationApiResponse = ResponseType<OrganisationType>;

function useOrganisationMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OrganisationApiResponse>['response'],
    AxiosResponseAndError<OrganisationApiResponse>['error'],
    z.infer<typeof createOrganisationSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<OrganisationApiResponse>(requestURLs.organisation, data),
  });

  return mutation;
}

export default useOrganisationMutation;
