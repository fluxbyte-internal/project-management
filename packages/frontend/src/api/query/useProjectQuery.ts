import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios, { AxiosError, AxiosResponse } from "axios";
import { QUERY_KEYS } from "./querykeys";
import { ErrorResponseType, ResponseType } from "../types/axiosResponseType";

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

export type AxiosResponseAndError<T> = {
  response: AxiosResponse<T>;
  error: AxiosError<ErrorResponseType>;
};

function useProjectQuery() {
  const query = useQuery<
    AxiosResponseAndError<ProjectApiResponse>["response"],
    AxiosResponseAndError<ProjectApiResponse>["error"]
  >({
    queryFn: () =>
      axios.get<ProjectApiResponse>(requestURLs.getProject),
    queryKey: [QUERY_KEYS.getProjects],
  });

  return query;
}

export default useProjectQuery;
