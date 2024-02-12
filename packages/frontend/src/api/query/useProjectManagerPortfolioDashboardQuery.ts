import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import { QUERY_KEYS } from "./querykeys";
import ApiRequest from "../ApiRequest";
import { requestURLs } from "@/Environment";
import { useQuery } from "@tanstack/react-query";
import { OrgStatusEnumValue, UserRoleEnumValue } from "@backend/src/schemas/enums";
import { TaskColorPaletteEnum } from "@backend/src/schemas/userSchema";
import { OrgListOfNonWorkingDaysEnum } from "@backend/src/schemas/organisationSchema";
  
export type UserOrganisationType = {
    userOrganisationId: string;
    jobTitle?: string;
    role?: keyof typeof UserRoleEnumValue;
    taskColour?: TaskColorPaletteEnum;
    user: {
      userId: string;
      email: string;
      firstName?: string;
      lastName?: string;
      avatarImg?: string;
    };
  };
  
export type OrganisationResponseType = ResponseType<{
    organisationId: string;
    organisationName: string;
    industry: string;
    status: keyof typeof OrgStatusEnumValue;
    country: string;
    nonWorkingDays: OrgListOfNonWorkingDaysEnum[];
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
    createdBy: string;
    userOrganisation: UserOrganisationType[];
  }>;

export interface ProjectManagersProjects {
    projectId: string
    organisationId: string
    projectName: string
    projectDescription: string
    startDate: string
    estimatedEndDate: string
    status: string
    defaultView: string
    timeTrack: any
    budgetTrack: any
    currency: string
    overallTrack: string
    estimatedBudget: string
    actualCost: any
    createdByUserId: string
    updatedByUserId: string
    createdAt: string
    updatedAt: string
  }
export interface Project {
    projectId: string
    organisationId: string
    projectName: string
    projectDescription: string
    startDate: string
    estimatedEndDate: string
    status: string
    defaultView: string
    timeTrack: any
    budgetTrack: any
    currency: string
    overallTrack: string
    estimatedBudget: string
    actualCost: any
    createdByUserId: string
    updatedByUserId: string
    createdAt: string
    updatedAt: string
  }
  
export interface StatusChartData {
    labels: string[]
    data: number[]
  }
  
export interface OverallSituationChartData {
    labels: string[]
    data: number[]
  }

  
export type maangerPortfolioDashboardResponseType = ResponseType<{
  projects : ProjectManagersProjects[],
    statusChartData: StatusChartData,
    overallSituationChartData: OverallSituationChartData
}>

export type managerDashboardPortfolioDataType = {
  projects : ProjectManagersProjects[],
    statusChartData: StatusChartData,
    overallSituationChartData: OverallSituationChartData

}
function useProjectManagerPortfolioDashboardQuery() {
  return useQuery<
      AxiosResponseAndError<maangerPortfolioDashboardResponseType>["response"],
      AxiosResponseAndError<maangerPortfolioDashboardResponseType>["error"]
    >({
      queryKey: [QUERY_KEYS.organisation],
      queryFn: async () =>
        await ApiRequest.get(`${requestURLs.managerPortfolioDashboardData}`),
    });
}
  
export default useProjectManagerPortfolioDashboardQuery;
  