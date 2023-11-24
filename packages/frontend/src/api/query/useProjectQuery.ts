import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "./querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import ApiRequest from "../ApiRequest";

export type Project = {
  projectId: string;
  organisationId: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  projectManager: string;
  profile: string;
  estimatedEndDate: string;
  actualEndDate: string | null;
  status: string;
  defaultView: string;
  timeTrack: string | null;
  budgetTrack: string | null;
  estimatedBudget: string;
  actualCost: string | null;
  progressionPercentage: number | string | null;
  createdAt: string;
  updatedAt: string;
};
type ProjectApiResponse = ResponseType<Project[]>;

function useProjectQuery() {
  return useQuery<
    AxiosResponseAndError<ProjectApiResponse>["response"],
    AxiosResponseAndError<ProjectApiResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.getProjects],
    queryFn: async () => await ApiRequest.get(requestURLs.organisation),
    enabled: false,
  });
}

export default useProjectQuery;
