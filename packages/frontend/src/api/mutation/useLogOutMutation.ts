import { useMutation } from '@tanstack/react-query';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import ApiRequest from '../ApiRequest';
import { requestURLs } from '@/Environment';

export type LogOutApiResponse = ResponseType<null>;

function useLogOutMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<LogOutApiResponse>['response'],
    AxiosResponseAndError<LogOutApiResponse>['error']
  >({
    mutationFn: () => ApiRequest.post<LogOutApiResponse>(requestURLs.logOut),
  });

  return mutation;
}

export default useLogOutMutation;
