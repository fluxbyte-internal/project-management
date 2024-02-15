import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { dependenciesTaskSchema } from '@backend/src/schemas/taskSchema';
import ApiRequest from '../ApiRequest';
import { requestURLs } from '../../Environment';
import { Task } from './useTaskCreateMutation';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskDependenciesResponse = ResponseType<Task>;

function useTaskDependenciesMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskDependenciesResponse>['response'],
    AxiosResponseAndError<TaskDependenciesResponse>['error'],
    z.infer<typeof dependenciesTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskDependenciesResponse>(
        `${requestURLs.task}dependencies/${taskId}`,
        data,
      ),
  });

  return mutation;
}

export default useTaskDependenciesMutation;
