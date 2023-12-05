import { useQuery } from "@tanstack/react-query";
import ApiRequest from "../ApiRequest";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import { QUERY_KEYS } from "./querykeys";
import { requestURLs } from "@/Environment";

export interface ProjectDetailType {
  projectId: string;
  organisationId: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  estimatedEndDate: string;
  status: string;
  defaultView: string;
  timeTrack: null;
  budgetTrack: null;
  estimatedBudget: string;
  actualCost: null;
  progressionPercentage: null;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
  tasks: [];
  createdByUser: CreatedByUser;
  projectProgression: null;
}

export interface CreatedByUser {
  firstName: string;
  lastName: string;
  email: string;
  avatarImg: null;
}
type ProjectDetailsApiResponse = ResponseType<ProjectDetailType>;

function useProjectDetail(id: string | undefined) {
  return useQuery<
    AxiosResponseAndError<ProjectDetailsApiResponse>["response"],
    AxiosResponseAndError<ProjectDetailsApiResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.getProjectDetails, id],
    queryFn: async () =>
      await ApiRequest.get(`${requestURLs.getProject}/${id}`),
    enabled: !!id,
  });
}
export default useProjectDetail;