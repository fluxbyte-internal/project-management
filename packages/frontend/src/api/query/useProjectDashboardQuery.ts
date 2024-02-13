import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import { QUERY_KEYS } from "./querykeys";
import ApiRequest from "../ApiRequest";
import { requestURLs } from "@/Environment";
import { useQuery } from "@tanstack/react-query";
import { ScheduleAndBudgetTrend } from "@backend/src/schemas/enums";

export type projectDashboardResponseType = ResponseType<{
  numTasks: number;
  numMilestones: number;
  projectDates: ProjectDates;
  projectBudgetTrend: any;
  taskStatusChartData: TaskStatusChartData;
  taskDelayChartData: any[];
  numTeamMembersWorkingOnTasks: number;
  projectOverAllSituation: string;
  projectStatus: string;
  spi: any[];
  cpi: any;
  budgetTrend:typeof ScheduleAndBudgetTrend;
  scheduleTrend: "STABLE";
  actualCost: string;
  consumedBudget:string;
  estimatedBudget: string;
  projectProgression: string;
}>;
export interface ProjectDates {
  startDate: string;
  estimatedEndDate: string;
  actualEndDate: string;
  projectCreatedAt: string;
  duration: number
}
export interface TaskStatusChartData {
  labels: any[];
  data: any[];
}

export type projectDashboardPortfolioDataType = {
  numTasks: number;
  numMilestones: number;
  projectDates: ProjectDates;
  projectBudgetTrend: any;
  taskStatusChartData: TaskStatusChartData;
  taskDelayChartData: any[];
  numTeamMembersWorkingOnTasks: number;
  projectOverAllSituation: string;
  projectStatus: string;
  spi: any[];
  cpi: any;
  budgetTrend:typeof ScheduleAndBudgetTrend;
  scheduleTrend: "STABLE";
  actualCost: string;
  consumedBudget:string;
  estimatedBudget: string;
  projectProgression: string;
};
function useProjectDashboardQuery(projectId: string | undefined) {
  return useQuery<
    AxiosResponseAndError<projectDashboardResponseType>["response"],
    AxiosResponseAndError<projectDashboardResponseType>["error"]
  >({
    queryKey: [QUERY_KEYS.organisation],
    queryFn: async () =>
      await ApiRequest.get(
        `${requestURLs.projectDashboardData + "/" + projectId}`
      ),
  });
}

export default useProjectDashboardQuery;
