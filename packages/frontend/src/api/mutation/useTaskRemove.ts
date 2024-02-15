import { useMutation } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskRemoveResponseType = ResponseType<null>;

function useRemoveTaskMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskRemoveResponseType>['response'],
    AxiosResponseAndError<TaskRemoveResponseType>['error'],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<TaskRemoveResponseType>(`${requestURLs.task}${data}`),
  });

  return mutation;
}

export default useRemoveTaskMutation;
