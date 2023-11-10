import { TaskDependenciesEnum, TaskStatusEnum } from "@prisma/client";
import { z } from "zod";


export const createTaskSchema = z.object({
  taskName: z.string(),
  taskDescription: z.string().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  duration: z.string(),
  status: z.nativeEnum(TaskStatusEnum),
  assignee: z.string(),
  documentAttachments: z.string().nullable(),
  dependencies: z.nativeEnum(TaskDependenciesEnum),
  milestoneIndicator: z.boolean(),
  flag: z.string().nullable(),
});

export const taskIdSchema = z.string().uuid();