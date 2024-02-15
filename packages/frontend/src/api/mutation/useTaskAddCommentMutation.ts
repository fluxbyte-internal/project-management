import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { createCommentTaskSchema } from '@backend/src/schemas/taskSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

export type Comment = {
  commentId: string;
  taskId: string;
  commentText: string;
  commentByUserId: string;
  createdAt: Date;
  updatedAt: Date;
};

type TaskCreateCommentResponseType = ResponseType<Comment>;

function useCreateTaskCommentMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskCreateCommentResponseType>['response'],
    AxiosResponseAndError<TaskCreateCommentResponseType>['error'],
    z.infer<typeof createCommentTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskCreateCommentResponseType>(
        `${requestURLs.task}/comment/${taskId}`,
        data,
      ),
  });

  return mutation;
}

export default useCreateTaskCommentMutation;
