import { useMutation } from '@tanstack/react-query';
import { AxiosResponseAndError, ResponseType } from '../types/axiosResponseType';
import { requestURLs } from '@/Environment';
import ApiRequest from '../ApiRequest';



export type LogOutApiResponse = ResponseType<null>;


function useLogOutMutation() {
  const mutation = useMutation<
  AxiosResponseAndError<LogOutApiResponse>["response"],
  AxiosResponseAndError<LogOutApiResponse>["error"]
 
>({
  mutationFn: () =>
    ApiRequest.post<LogOutApiResponse>(requestURLs.logOut),
});

  return mutation;
}


export default useLogOutMutation;