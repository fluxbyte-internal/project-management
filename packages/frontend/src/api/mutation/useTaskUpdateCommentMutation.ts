import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { createCommentTaskSchema } from '@backend/src/schemas/taskSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import { Comment } from './useTaskAddCommentMutation';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type TaskCreateCommentResponseType = ResponseType<Comment>;

function useUpdateTaskCommentMutation(commentId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskCreateCommentResponseType>['response'],
    AxiosResponseAndError<TaskCreateCommentResponseType>['error'],
    z.infer<typeof createCommentTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<TaskCreateCommentResponseType>(
        `${requestURLs.task}/comment/${commentId}`,
        data,
      ),
  });

  return mutation;
}

export default useUpdateTaskCommentMutation;
