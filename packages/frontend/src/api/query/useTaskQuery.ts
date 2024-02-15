import { useQuery } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import ApiRequest from '../ApiRequest';
import { Task } from '../mutation/useTaskCreateMutation';
import { QUERY_KEYS } from './querykeys';

type TaskResponse = ResponseType<Task>;

function useTaskQuery(taskId: string | undefined) {
  return useQuery<
    AxiosResponseAndError<TaskResponse>['response'],
    AxiosResponseAndError<TaskResponse>['error']
  >({
    enabled: true,
    queryFn: async () =>
      await ApiRequest.get(requestURLs.task + 'byId/' + taskId, {
        headers: { 'organisation-id': localStorage.getItem('organisation-id') },
      }),
    queryKey: [QUERY_KEYS.taskById],
  });
}

export default useTaskQuery;
