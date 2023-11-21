import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ErrorResponseType, ResponseType } from "./useLoginMutation";

export type Project ={
    projectId: string;
    organisationId: string;
    projectName: string;
    projectDescription: string;
    startDate: string;
    estimatedEndDate: string;
    actualEndDate: string | null;
    status: string;
    defaultView: string;
    timeTrack: string | null;
    budgetTrack: string | null;
    estimatedBudget: string;
    actualCost: string | null;
    progressionPercentage: string|number|null;
    createdAt: string;
    updatedAt: string;
}
type ProjectApiResponse = ResponseType<Project[]>;

export type AxiosResponseAndError<T> = {
  response: AxiosResponse<T>;
  error: AxiosError<ErrorResponseType>;
};

const headers = {
  "organisation-id": "61dd26ee-b064-43e9-b12f-21a7b7832737",
  authorization:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMjNmZDMyNy0xMWJlLTQwMGUtOWJmYS1hMzc1ZmI3YWE3NGIiLCJlbWFpbCI6InRlc3RAeW9wbWFpbC5jb20iLCJ0ZW5hbnRJZCI6InJvb3QiLCJpYXQiOjE3MDA1NDM0NTYsImV4cCI6MTcwMDYyOTg1Nn0.ULAnpAS3kq6mJN8sGoiAOXgYO-PWSCSm8PlLrj17k-M",
};
function useProjectMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectApiResponse>["response"],
    AxiosResponseAndError<ProjectApiResponse>["error"]
  >({
    mutationFn: () =>
      axios.get<ProjectApiResponse>(requestURLs.getProject, {
        headers: headers,
      }),
  });

  return mutation;
}

export default useProjectMutation;
