import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { verifyEmailOtpSchema } from '@backend/src/schemas/authSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

export type VerifyEmailResponse = ResponseType<null>;

function useVerifyEmailMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<VerifyEmailResponse>['response'],
    AxiosResponseAndError<VerifyEmailResponse>['error'],
    z.infer<typeof verifyEmailOtpSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<VerifyEmailResponse>(requestURLs.verifyEmail, data),
  });

  return mutation;
}

export default useVerifyEmailMutation;
