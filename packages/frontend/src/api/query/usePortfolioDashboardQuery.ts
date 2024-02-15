import { useQuery } from '@tanstack/react-query';
import {
  OrgStatusEnumValue,
  UserRoleEnumValue,
} from '@backend/src/schemas/enums';
import { TaskColorPaletteEnum } from '@backend/src/schemas/userSchema';
import { OrgListOfNonWorkingDaysEnum } from '@backend/src/schemas/organisationSchema';
import ApiRequest from '../ApiRequest';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import { QUERY_KEYS } from './querykeys';
import { requestURLs } from '@/Environment';

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

export interface OrgCreatedByUser {
  organisationId: string;
  organisationName: string;
  industry: string;
  status: string;
  country: string;
  nonWorkingDays: string[];
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  createdByUserId: string;
  updatedByUserId: string;
  projects: Project[];
}
export interface Project {
  projectId: string;
  organisationId: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  estimatedEndDate: string;
  status: string;
  defaultView: string;
  timeTrack: any;
  budgetTrack: any;
  currency: string;
  overallTrack: string;
  estimatedBudget: string;
  actualCost: any;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusChartData {
  labels: string[];
  data: number[];
}

export interface OverallSituationChartData {
  labels: string[];
  data: number[];
}

export type PortfolioDashboardResponseType = ResponseType<{
  orgCreatedByUser: OrgCreatedByUser;
  statusChartData: StatusChartData;
  overallSituationChartData: OverallSituationChartData;
}>;

export type DashboardPortfolioDataType = {
  orgCreatedByUser: OrgCreatedByUser;
  statusChartData: StatusChartData;
  overallSituationChartData: OverallSituationChartData;
};
function useAdminPortfolioDashboardQuery() {
  return useQuery<
    AxiosResponseAndError<PortfolioDashboardResponseType>['response'],
    AxiosResponseAndError<PortfolioDashboardResponseType>['error']
  >({
    queryFn: async () =>
      await ApiRequest.get(`${requestURLs.adminPortfolioDashboardData}`),
    queryKey: [QUERY_KEYS.organisation],
  });
}

export default useAdminPortfolioDashboardQuery;
