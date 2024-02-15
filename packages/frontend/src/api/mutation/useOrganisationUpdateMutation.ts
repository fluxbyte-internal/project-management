import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { updateOrganisationSchema } from '@backend/src/schemas/organisationSchema';
import ApiRequest from '../ApiRequest';
import { requestURLs } from '../../Environment';
import { OrganisationResponseType } from '../query/useOrganisationDetailsQuery';
import { AxiosResponseAndError } from '@/api/types/axiosResponseType';

function useOrganisationUpdateMutation(id: string) {
  const mutation = useMutation<
    AxiosResponseAndError<OrganisationResponseType>['response'],
    AxiosResponseAndError<OrganisationResponseType>['error'],
    z.infer<typeof updateOrganisationSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<OrganisationResponseType>(
        `${requestURLs.organisation}/${id}`,
        data,
      ),
  });

  return mutation;
}

export default useOrganisationUpdateMutation;
