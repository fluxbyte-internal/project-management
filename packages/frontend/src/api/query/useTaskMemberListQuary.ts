import { useQuery } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import ApiRequest from '../ApiRequest';
import { QUERY_KEYS } from './querykeys';
import { UserOrganisationType } from './useOrganisationDetailsQuery';

type TaskMemberListApiResponse = ResponseType<UserOrganisationType[]>;

function useTaskMemberListQuery(projectId: string) {
  return useQuery<
    AxiosResponseAndError<TaskMemberListApiResponse>['response'],
    AxiosResponseAndError<TaskMemberListApiResponse>['error']
  >({
    enabled: true,
    queryFn: async () =>
      await ApiRequest.get(`${requestURLs.task}/taskAssignUsers/${projectId}`, {
        headers: { 'organisation-id': localStorage.getItem('organisation-id') },
      }),
    queryKey: [QUERY_KEYS.taskMamber],
  });
}

export default useTaskMemberListQuery;
