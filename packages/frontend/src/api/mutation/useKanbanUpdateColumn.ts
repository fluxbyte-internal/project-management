import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { updateKanbanSchema } from '@backend/src/schemas/projectSchema';
import { requestURLs } from '../../Environment';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '@/api/types/axiosResponseType';

export type KanbanColumnType = {
  name: string;
  percentage: number | null;
  projectId: string;
  createdByUserId: string;
  updatedByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  kanbanColumnId: string;
};
type KanbanColumnApiResponse = ResponseType<KanbanColumnType>;

function useKanbanUpdateColumnMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<KanbanColumnApiResponse>['response'],
    AxiosResponseAndError<KanbanColumnApiResponse>['error'],
    z.infer<typeof updateKanbanSchema> & { id: string | undefined }
  >({
    mutationFn: (data) =>
      ApiRequest.put<KanbanColumnApiResponse>(
        requestURLs.kanbanColumn + data.id,
        data,
      ),
  });

  return mutation;
}

export default useKanbanUpdateColumnMutation;
