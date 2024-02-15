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

function useUpdateOrganisationMemberMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OrgAddMemberResponseType>['response'],
    AxiosResponseAndError<OrgAddMemberResponseType>['error'],
    z.infer<typeof addOrganisationMemberSchema> & { userId: string | undefined }
  >({
    mutationFn: (data) =>
      ApiRequest.put<OrgAddMemberResponseType>(
        `${requestURLs.organisation}/change-role/${data.userId}`,
        data,
      ),
  });

  return mutation;
}

export default useUpdateOrganisationMemberMutation;
