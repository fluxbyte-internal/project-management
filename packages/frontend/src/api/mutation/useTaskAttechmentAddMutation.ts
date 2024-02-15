import { useMutation } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import { Task } from './useTaskCreateMutation';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskAttechmentAddResponse = ResponseType<Task>;

function useTaskAttechmentAddMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskAttechmentAddResponse>['response'],
    AxiosResponseAndError<TaskAttechmentAddResponse>['error'],
    FormData
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskAttechmentAddResponse>(
        `${requestURLs.task}attachment/${taskId}`,
        data,
      ),
  });

  return mutation;
}

export default useTaskAttechmentAddMutation;
