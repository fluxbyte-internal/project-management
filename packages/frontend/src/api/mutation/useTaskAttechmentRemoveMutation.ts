import { useMutation } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import { Task } from './useTaskCreateMutation';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskRemoveAttachmentResponseType = ResponseType<Task>;

function useRemoveTaskAttachmentMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskRemoveAttachmentResponseType>['response'],
    AxiosResponseAndError<TaskRemoveAttachmentResponseType>['error'],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<TaskRemoveAttachmentResponseType>(
        `${requestURLs.task}attachment/${data}`,
      ),
  });

  return mutation;
}

export default useRemoveTaskAttachmentMutation;
