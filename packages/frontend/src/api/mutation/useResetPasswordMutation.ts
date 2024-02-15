import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import axios from 'axios';
import { requestURLs } from '../../Environment';
import type { resetPasswordTokenSchema } from 'backend/src/schemas/authSchema';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

export type ForgotEmailSend = ResponseType<null>;

function useResetPasswordMutation(token: string) {
  const mutation = useMutation<
    AxiosResponseAndError<ForgotEmailSend>['response'],
    AxiosResponseAndError<ForgotEmailSend>['error'],
    z.infer<typeof resetPasswordTokenSchema>
  >({
    mutationFn: (data) =>
      axios.put<ForgotEmailSend>(`${requestURLs.resetPassword}/${token}`, data),
  });

  return mutation;
}
export default useResetPasswordMutation;
