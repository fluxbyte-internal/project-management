import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { authSignUpSchema } from '@backend/src/schemas/authSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type SignupResponseType = ResponseType<{
  token: string;
  user: {
    userId: string;
    email: string;
    status: string;
    firstName: string | null;
    lastName: string | null;
    timezone: string | null;
    country: string | null;
    avatarImg: string | null;
    createdAt: string;
    updatedAt: string;
  };
}>;

function useSignupMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<SignupResponseType>['response'],
    AxiosResponseAndError<SignupResponseType>['error'],
    z.infer<typeof authSignUpSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<SignupResponseType>(requestURLs.signup, data),
  });

  return mutation;
}

export default useSignupMutation;
