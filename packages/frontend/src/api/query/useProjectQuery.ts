import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "./querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { OverAllTrackEnumValue, ProjectDefaultViewEnumValue, ScheduleAndBudgetTrend, UserRoleEnumValue } from "@backend/src/schemas/enums";

export type Project = {
  overallTrack:  keyof typeof OverAllTrackEnumValue;
  projectId: string;
  assignedUsers: AssignedUsers[];
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
  projectManagerInfo:{user:CreatedByUser}[]
  scheduleTrend:keyof typeof ScheduleAndBudgetTrend
budgetTrend:keyof typeof ScheduleAndBudgetTrend
consumedBudget:string
};
export interface AssignedUsers {
  projectAssignUsersId: string;
  projectId:            string;
  assginedToUserId:     string;
  createdAt:            Date;
  updatedAt:            Date;
  user:                 User;
}

export interface User {
  userId:           string;
  email:            string;
  status:           string;
  firstName:        null;
  lastName:         null;
  timezone:         null;
  country:          null;
  avatarImg:        null;
  isVerified:       boolean;
  createdAt:        Date;
  updatedAt:        Date;
  userOrganisation: UserOrganisation[];
}

export interface UserOrganisation {
  role: keyof typeof UserRoleEnumValue;
}
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
