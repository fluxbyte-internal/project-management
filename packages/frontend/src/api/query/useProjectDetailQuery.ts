import { useQuery } from '@tanstack/react-query';
import { ProjectDefaultViewEnumValue } from '@backend/src/schemas/enums';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import { QUERY_KEYS } from './querykeys';
import { AssignedUsers } from './useProjectQuery';
import { requestURLs } from '@/Environment';

export interface ProjectDetailType {
  projectId: string;
  organisationId: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  estimatedEndDate: string;
  status: string;
  defaultView: keyof typeof ProjectDefaultViewEnumValue;
  timeTrack: string | null;
  budgetTrack: string | null;
  estimatedBudget: string;
  actualCost: string | null;
  overallTrack: string | null;
  progressionPercentage: string | null;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
  tasks: [];
  createdByUser: CreatedByUser;
  projectProgression: string | null;
  assignedUsers: AssignedUsers[];
  actualEndDate: Date | null;
}

export interface CreatedByUser {
  firstName: string;
  lastName: string;
  email: string;
  avatarImg: string | null;
}
type ProjectDetailsApiResponse = ResponseType<ProjectDetailType>;

function useProjectDetail(id: string | undefined) {
  return useQuery<
    AxiosResponseAndError<ProjectDetailsApiResponse>['response'],
    AxiosResponseAndError<ProjectDetailsApiResponse>['error']
  >({
    enabled: Boolean(id),
    queryFn: async () => await ApiRequest.get(`${requestURLs.project}/${id}`),
    queryKey: [QUERY_KEYS.getProjectDetails, id],
  });
}
export default useProjectDetail;
