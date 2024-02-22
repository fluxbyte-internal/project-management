import {
  AxiosResponseAndError,
  ResponseType,
} from "../types/axiosResponseType";
import { QUERY_KEYS } from "./querykeys";
import ApiRequest from "../ApiRequest";
import { requestURLs } from "@/Environment";
import { useQuery } from "@tanstack/react-query";
import { OverAllTrackEnumValue, ScheduleAndBudgetTrend } from "@backend/src/schemas/enums";

export type projectDashboardResponseType = ResponseType<{
  projectName:string
  numTasks: number;
  numMilestones: number;
  projectDates: ProjectDates;
  projectBudgetTrend: keyof typeof ScheduleAndBudgetTrend;
  taskStatusChartData: TaskStatusChartData;
  taskDelayChartData: {
    taskId:   string;
    taskName: string;
    tpiValue: number;
    tpiFlag:  string;
}[];
  numTeamMembersWorkingOnTasks: number;
  projectOverAllSituation: keyof typeof OverAllTrackEnumValue;
  projectStatus: string;
  spi: {
    taskId:     string;
    taskName:   string;
    spi:        number;
    taskStatus: string;
}[];
  cpi: number | undefined;
  budgetTrend:keyof typeof ScheduleAndBudgetTrend;
  scheduleTrend: keyof typeof ScheduleAndBudgetTrend;
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
  projectName:string
  numTasks: number;
  numMilestones: number;
  projectDates: ProjectDates;
  projectBudgetTrend: keyof typeof ScheduleAndBudgetTrend;
  taskStatusChartData: TaskStatusChartData;
  taskDelayChartData: {
    taskId:   string;
    taskName: string;
    tpiValue: number;
    tpiFlag:  string;
}[];
  numTeamMembersWorkingOnTasks: number;
  projectOverAllSituation: keyof typeof OverAllTrackEnumValue;
  projectStatus: string;
  spi: {
    taskId:     string;
    taskName:   string;
    spi:        number;
    taskStatus: string;
}[];
  cpi: number | undefined;
  budgetTrend:keyof typeof ScheduleAndBudgetTrend;
  scheduleTrend: keyof typeof ScheduleAndBudgetTrend;
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
