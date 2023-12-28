import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { createTaskSchema } from "@backend/src/schemas/taskSchema";
import ApiRequest from "../ApiRequest";
import { TaskDependenciesEnumValue } from "@backend/src/schemas/enums";
import { UserType } from "../query/useCurrentUserQuery";
import { UserOrganisationType } from "../query/useOrganisationDetailsQuery";

export type Task = {
  taskId: string;
  projectId: string;
  taskName: string;
  taskDescription: string;
  startDate: Date;
  duration: number;
  completionPecentage: null;
  status: string;
  milestoneIndicator: boolean;
  createdByUserId: string;
  updatedByUserId: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  parentTaskId: null | string;
  dependencies: Dependencies[];
  comments: Comments[];
  documentAttachments: DocumentAttachment[];
  endDate: Date;
  flag: string;
  subtasks: Task[];
  assignedUsers: [
    { taskAssignUsersId: string; user: UserOrganisationType["user"] }
  ];
  history: History[];
};
export interface History {
  historyId: string;
  historyReferenceId: string;
  historyType: string;
  historyData: HistoryData;
  historyMessage: string;
  historyCreatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  historyCreatedByUser: UserOrganisationType["user"];
}

export interface HistoryData {
  newValue: string;
  oldValue: string | null;
}

export interface Dependencies {
  taskDependenciesId: string;
  dependentTaskId: string;
  dependentType: keyof typeof TaskDependenciesEnumValue;
  dependendentOnTaskId: string;
  createdAt: Date;
  updatedAt: Date;
  dependentOnTask: Task;
}

export interface DependentOnTask {
  taskId: string;
  projectId: string;
  taskName: string;
  taskDescription: string;
  startDate: Date;
  duration: number;
  completionPecentage: null;
  status: string;
  milestoneIndicator: boolean;
  dueDate: null;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  parentTaskId: string;
  endDate: Date;
  flag: string;
}
export interface Comments {
  commentId: string;
  taskId: string;
  commentText: string;
  commentByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  commentByUser: UserType;
}
export interface DocumentAttachment {
  attachmentId: string;
  name: string;
  url: string;
  taskId: string;
  createdAt: Date;
  updateAt: Date;
}
type CreateTaskResponseType = ResponseType<Task>;

function useCreateTaskMutation(projectId?: string, taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<CreateTaskResponseType>["response"],
    AxiosResponseAndError<CreateTaskResponseType>["error"],
    z.infer<typeof createTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<CreateTaskResponseType>(
        `${requestURLs.task}${projectId}/${taskId}`,
        data
      ),
  });

  return mutation;
}

export default useCreateTaskMutation;
