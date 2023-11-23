import { UserResponseType } from '@/hooks/useUser';
import { AxiosResponseAndError } from '../types/axiosResponseType';
import { QUERY_KEYS } from './querykeys';
import ApiRequest from '../ApiRequest';
import { requestURLs } from '@/Environment';
import { useQuery } from '@tanstack/react-query';

function useCurrentUserQuery() {
  
  return useQuery<AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"]>({ queryKey: [QUERY_KEYS.currentUser], queryFn: async () => await ApiRequest.get(requestURLs.me), enabled: false });
}

export default useCurrentUserQuery;