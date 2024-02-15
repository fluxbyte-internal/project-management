import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { userOrgSettingsUpdateSchema } from '@backend/src/schemas/userSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type UseOrgSettingsUpdateResponse = ResponseType<null>;

function useOrgSettingsUpdateMutation(id: string) {
  const mutation = useMutation<
    AxiosResponseAndError<UseOrgSettingsUpdateResponse>['response'],
    AxiosResponseAndError<UseOrgSettingsUpdateResponse>['error'],
    z.infer<typeof userOrgSettingsUpdateSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<UseOrgSettingsUpdateResponse>(
        requestURLs.updateUserOrganisationSettings + id,
        data,
      ),
  });

  return mutation;
}

export default useOrgSettingsUpdateMutation;
