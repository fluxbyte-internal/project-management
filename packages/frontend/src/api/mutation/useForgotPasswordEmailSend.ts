import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import axios from 'axios';
import { requestURLs } from '../../Environment';
import type { forgotPasswordSchema } from 'backend/src/schemas/authSchema';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

export type ForgotEmailSend = ResponseType<null>;

function useForgotPassword() {
  const mutation = useMutation<
    AxiosResponseAndError<ForgotEmailSend>['response'],
    AxiosResponseAndError<ForgotEmailSend>['error'],
    z.infer<typeof forgotPasswordSchema>
  >({
    mutationFn: (data) =>
      axios.post<ForgotEmailSend>(requestURLs.forgotPassword, data),
  });

  return mutation;
}
export default useForgotPassword;
