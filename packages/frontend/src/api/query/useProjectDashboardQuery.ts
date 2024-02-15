import { useQuery } from '@tanstack/react-query';
import { ScheduleAndBudgetTrend } from '@backend/src/schemas/enums';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import ApiRequest from '../ApiRequest';
import { QUERY_KEYS } from './querykeys';
import { requestURLs } from '@/Environment';

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
  budgetTrend: typeof ScheduleAndBudgetTrend;
  scheduleTrend: 'STABLE';
  actualCost: string;
  consumedBudget: string;
  estimatedBudget: string;
  projectProgression: string;
}>;
export interface ProjectDates {
  startDate: string;
  estimatedEndDate: string;
  actualEndDate: string;
  projectCreatedAt: string;
  duration: number;
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
  budgetTrend: typeof ScheduleAndBudgetTrend;
  scheduleTrend: 'STABLE';
  actualCost: string;
  consumedBudget: string;
  estimatedBudget: string;
  projectProgression: string;
};
function useProjectDashboardQuery(projectId: string | undefined) {
  return useQuery<
    AxiosResponseAndError<projectDashboardResponseType>['response'],
    AxiosResponseAndError<projectDashboardResponseType>['error']
  >({
    queryFn: async () =>
      await ApiRequest.get(
        `${requestURLs.projectDashboardData + '/' + projectId}`,
      ),
    queryKey: [QUERY_KEYS.organisation],
  });
}

export default useProjectDashboardQuery;
