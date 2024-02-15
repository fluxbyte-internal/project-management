import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { requestURLs } from '../../Environment';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

export type LoginApiResponse = ResponseType<boolean>;
type rootUser = { username: string; password: string };

function useRootAuthMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<LoginApiResponse>['response'],
    AxiosResponseAndError<LoginApiResponse>['error'],
    rootUser
  >({
    mutationFn: (data) =>
      axios.post<LoginApiResponse>(requestURLs.rootAuth, data),
  });

  return mutation;
}

export default useRootAuthMutation;
