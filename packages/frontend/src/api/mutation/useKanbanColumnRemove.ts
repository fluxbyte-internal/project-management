import { useMutation } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

type kanbanRemoveColumnsResponseType = ResponseType<null>;

function useRemoveKanbanColumnsMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<kanbanRemoveColumnsResponseType>['response'],
    AxiosResponseAndError<kanbanRemoveColumnsResponseType>['error'],
    string
  >({
    mutationFn: (data) =>
      ApiRequest.delete<kanbanRemoveColumnsResponseType>(
        `${requestURLs.kanbanColumn}${data}`,
      ),
  });

  return mutation;
}

export default useRemoveKanbanColumnsMutation;
