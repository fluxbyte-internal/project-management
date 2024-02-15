import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { reAssginedTaskSchema } from '@backend/src/schemas/organisationSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type ReAssgingTaskApiResponse = ResponseType<null>;

function useReAssgingTaskMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ReAssgingTaskApiResponse>['response'],
    AxiosResponseAndError<ReAssgingTaskApiResponse>['error'],
    z.infer<typeof reAssginedTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<ReAssgingTaskApiResponse>(
        `${requestURLs.organisation}/re-assigned-task`,
        data,
        {
          headers: {
            'organisation-id': localStorage.getItem('organisation-id'),
          },
        },
      ),
  });

  return mutation;
}
export default useReAssgingTaskMutation;
