import { AxiosResponseAndError, ResponseType } from '../types/axiosResponseType';
import { useMutation } from '@tanstack/react-query';
import ApiRequest from '../ApiRequest';
import { requestURLs } from '@/Environment';
// import { ResponseType } from 'axios';



type RemoveMemberResponseType = ResponseType<null>;

function useOrganisationRemoveMemberMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<RemoveMemberResponseType>["response"],
    AxiosResponseAndError<RemoveMemberResponseType>["error"],
    string
   
  >({
    mutationFn: (id:string) =>
      ApiRequest.delete<RemoveMemberResponseType>(
        `${requestURLs.organisation}/${id}`
        
      ),
  });

  return mutation;
}

export default useOrganisationRemoveMemberMutation;