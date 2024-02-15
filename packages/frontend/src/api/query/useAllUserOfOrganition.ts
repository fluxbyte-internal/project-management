import { useQuery } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import ApiRequest from '../ApiRequest';
import { QUERY_KEYS } from './querykeys';
import { UserOrganisationType } from './useOrganisationDetailsQuery';

type ProjectMemberListApiResponse = ResponseType<UserOrganisationType[]>;

function useProjectMemberListQuery() {
  return useQuery<
    AxiosResponseAndError<ProjectMemberListApiResponse>['response'],
    AxiosResponseAndError<ProjectMemberListApiResponse>['error']
  >({
    enabled: true,
    queryFn: async () =>
      await ApiRequest.get(`${requestURLs.project}/org-users`, {
        headers: { 'organisation-id': localStorage.getItem('organisation-id') },
      }),
    queryKey: [QUERY_KEYS.ProjectMember],
  });
}

export default useProjectMemberListQuery;
