import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { milestoneTaskSchema } from '@backend/src/schemas/taskSchema';
import ApiRequest from '../ApiRequest';
import { requestURLs } from '../../Environment';
import { Task } from './useTaskCreateMutation';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskAddUpdateMilestoneResponse = ResponseType<Task>;

function useTaskAddUpdateMilestoneMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskAddUpdateMilestoneResponse>['response'],
    AxiosResponseAndError<TaskAddUpdateMilestoneResponse>['error'],
    z.infer<typeof milestoneTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskAddUpdateMilestoneResponse>(
        `${requestURLs.task}milestone/${taskId}`,
        data,
      ),
  });

  return mutation;
}

export default useTaskAddUpdateMilestoneMutation;
