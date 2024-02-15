import { useMutation } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import { UserResponseType } from '../query/useCurrentUserQuery';
import ApiRequest from '../ApiRequest';
import { AxiosResponseAndError } from '@/api/types/axiosResponseType';

function useFileUploadMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<UserResponseType>['response'],
    AxiosResponseAndError<UserResponseType>['error'],
    FormData
  >({
    mutationFn: (data) =>
      ApiRequest.put<UserResponseType>(requestURLs.fileUpload, data),
  });

  return mutation;
}
export default useFileUploadMutation;
