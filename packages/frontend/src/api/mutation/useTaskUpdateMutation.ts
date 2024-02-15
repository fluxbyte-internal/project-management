import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { updateTaskSchema } from '@backend/src/schemas/taskSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import { Task } from './useTaskCreateMutation';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type UpdateTaskResponseType = ResponseType<Task>;

function useUpdateTaskMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<UpdateTaskResponseType>['response'],
    AxiosResponseAndError<UpdateTaskResponseType>['error'],
    z.infer<typeof updateTaskSchema> & { id?: string }
  >({
    mutationFn: (data) => {
      const id = data.id ? data.id : taskId;
      return ApiRequest.put<UpdateTaskResponseType>(
        requestURLs.task + id,
        data,
      );
    },
  });

  return mutation;
}

export default useUpdateTaskMutation;
