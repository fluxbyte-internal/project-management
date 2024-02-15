import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import type { addOrganisationMemberSchema } from 'backend/src/schemas/organisationSchema';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type OrgAddMemberResponseType = ResponseType<null>;

function useAddOrganisationMemberMutation(organisationId: string) {
  const mutation = useMutation<
    AxiosResponseAndError<OrgAddMemberResponseType>['response'],
    AxiosResponseAndError<OrgAddMemberResponseType>['error'],
    z.infer<typeof addOrganisationMemberSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<OrgAddMemberResponseType>(
        `${requestURLs.organisation}/${organisationId}/user`,
        data,
      ),
  });

  return mutation;
}

export default useAddOrganisationMemberMutation;
