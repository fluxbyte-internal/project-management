import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ErrorResponseType, ResponseType } from "./useLoginMutation";

export type Project = {
  projectId: string;
  organisationId: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  projectManager:string;
  estimatedEndDate: string;
  actualEndDate: string | null;
  status: string;
  defaultView: string;
  timeTrack: string | null;
  budgetTrack: string | null;
  estimatedBudget: string;
  actualCost: string | null;
  progressionPercentage: number | string ;
  createdAt: string;
  updatedAt: string;
};
type ProjectApiResponse = ResponseType<Project[]>;

export type AxiosResponseAndError<T> = {
  response: AxiosResponse<T>;
  error: AxiosError<ErrorResponseType>;
};

function useProjectMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectApiResponse>["response"],
    AxiosResponseAndError<ProjectApiResponse>["error"]
  >({
    mutationFn: () =>
      axios.get<ProjectApiResponse>(requestURLs.getProject),
  });

  return mutation;
}

export default useProjectMutation;
