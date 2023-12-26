import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "./querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { ProjectDefaultViewEnumValue } from "@backend/src/schemas/enums";

export type Project = {
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
  progressionPercentage: number | string | null;
  createdAt: string;
  updatedAt: string;
  createdByUser: CreatedByUser;
  currency:string;
};
export interface CreatedByUser {
  firstName: string;
  lastName: string;
  email: string;
  avatarImg: null;
}
type ProjectApiResponse = ResponseType<Project[]>;

function useProjectQuery() {
  return useQuery<
    AxiosResponseAndError<ProjectApiResponse>["response"],
    AxiosResponseAndError<ProjectApiResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.getProjects],
    queryFn: async () =>
      await ApiRequest.get(requestURLs.project, {
        headers: { "organisation-id": localStorage.getItem("organisation-id") },
      }),
    enabled: true,
  });
}

export default useProjectQuery;
