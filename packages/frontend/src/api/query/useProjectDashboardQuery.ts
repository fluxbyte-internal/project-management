import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import { QUERY_KEYS } from "./querykeys";
import ApiRequest from "../ApiRequest";
import { requestURLs } from "@/Environment";
import { useQuery } from "@tanstack/react-query";
  
export type projectDashboardResponseType = ResponseType<{
  numTasks: number
  numMilestones: number
  projectDates: ProjectDates
  projectBudgetTrend: any
  taskStatusChartData: TaskStatusChartData
  taskDelayChartData: any[]
  numTeamMembersWorkingOnTasks: number
  projectOverAllSituation: string
  projectStatus: string
}>
export interface ProjectDates {
  startDate: string
  estimatedEndDate: string
}
export interface TaskStatusChartData {
  labels: any[]
  data: any[]
}

export type projectDashboardPortfolioDataType = {
  numTasks: number
  numMilestones: number
  projectDates: ProjectDates
  projectBudgetTrend: any
  taskStatusChartData: TaskStatusChartData
  taskDelayChartData: any[]
  numTeamMembersWorkingOnTasks: number
  projectOverAllSituation: string
  projectStatus: string
}
function useProjectDashboardQuery(projectId: string|undefined) {
  return useQuery<
      AxiosResponseAndError<projectDashboardResponseType>["response"],
      AxiosResponseAndError<projectDashboardResponseType>["error"]
    >({
      queryKey: [QUERY_KEYS.organisation],
      queryFn: async () =>
        await ApiRequest.get(`${requestURLs.projectDashboardData + "/" + projectId}`),
    });
}
  
export default useProjectDashboardQuery;
  