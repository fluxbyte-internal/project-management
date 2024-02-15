import { useMutation } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type ProjectRemoveMemberResponseType = ResponseType<null>;

function useRemoveProjectMemberMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectRemoveMemberResponseType>['response'],
    AxiosResponseAndError<ProjectRemoveMemberResponseType>['error'],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<ProjectRemoveMemberResponseType>(
        `${requestURLs.project}/remove-assignee/${data}`,
      ),
  });

  return mutation;
}

export default useRemoveProjectMemberMutation;
