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

export type Task = {
  taskId: string;
  projectId: string;
  taskName: string;
  taskDescription: string;
  startDate: Date;
  duration: number;
  completionPecentage: null;
  status: string;
  assginedToUserId: string;
  dependencies: keyof typeof TaskDependenciesEnumValue;
  milestoneIndicator: boolean;
  flag: string;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  parentTaskId: null;
  documentAttachments: any[];
  endDate: Date;
  comments: comments[];
  subtasks:Task[]
};

export interface comments {
  commentId: string;
  taskId: string;
  commentText: string;
  commentByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  commentByUser: UserType;
}

type CreateTaskResponseType = ResponseType<Task>;

function useCreateTaskMutation(projectId?: string,taskId?: string) {
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
