import { useMutation } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskRemoveMemberResponseType = ResponseType<null>;

function useRemoveTaskMemberMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskRemoveMemberResponseType>['response'],
    AxiosResponseAndError<TaskRemoveMemberResponseType>['error'],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<TaskRemoveMemberResponseType>(
        `${requestURLs.task}member/${data}`,
      ),
  });

  return mutation;
}

export default useRemoveTaskMemberMutation;
