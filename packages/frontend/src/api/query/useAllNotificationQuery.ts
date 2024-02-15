import { useQuery } from '@tanstack/react-query';
import { requestURLs } from '../../Environment';
import {
  AxiosResponseAndError,
  ResponseType,
} from '../types/axiosResponseType';
import ApiRequest from '../ApiRequest';
import { QUERY_KEYS } from './querykeys';

export interface NotificationType {
  notificationId: string;
  type: string;
  referenceId: string;
  sentBy: string;
  sentTo: string;
  details: string;
  isRead: boolean;
  createdAt: string;
  ReadAt: string;
  sentNotificationBy: SentNotificationBy;
  sentNotificationTo: SentNotificationTo;
  task: TaskType;
}

export interface SentNotificationBy {
  avatarImg: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SentNotificationTo {
  avatarImg: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface TaskType {
  taskId: string;
  projectId: string;
  taskName: string;
  taskDescription: string;
  startDate: string;
  duration: number;
  completionPecentage: number;
  status: string;
  milestoneIndicator: boolean;
  dueDate: Date;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
  parentTaskId: string;
  endDate: string;
  flag: string;
}

export type NotificationResponse = ResponseType<NotificationType[]>;

function useAllNotificationQuery() {
  return useQuery<
    AxiosResponseAndError<NotificationResponse>['response'],
    AxiosResponseAndError<NotificationResponse>['error']
  >({
    enabled: true,
    queryFn: async () => await ApiRequest.get(requestURLs.notification),
    queryKey: [QUERY_KEYS.allNotification],
  });
}

export default useAllNotificationQuery;
