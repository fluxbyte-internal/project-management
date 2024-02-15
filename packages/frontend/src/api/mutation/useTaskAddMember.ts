import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { assginedToUserIdSchema } from '@backend/src/schemas/taskSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskAddMembersResponse = ResponseType<{
  taskAssignUsersId: string;
  taskId: string;
  assginedToUserId: string;
  createdAt: Date;
  updatedAt: Date;
}>;

function useTaskAddMembersMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskAddMembersResponse>['response'],
    AxiosResponseAndError<TaskAddMembersResponse>['error'],
    z.infer<typeof assginedToUserIdSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskAddMembersResponse>(
        `${requestURLs.task}member/${taskId}`,
        data,
      ),
  });

  return mutation;
}

export default useTaskAddMembersMutation;
