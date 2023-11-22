import { TaskDependenciesEnum, TaskStatusEnum } from "@prisma/client";
import { z } from "zod";


export const taskIdSchema = z.string().uuid();

export const createTaskSchema = z.object({
  taskName: z.string(),
  taskDescription: z.string().optional(),
  startDate: z.string(),
  duration: z.number(),
  status: z.nativeEnum(TaskStatusEnum),
  assignee: z.string(),
  documentAttachments: z.object({
    name: z.string(),
    url: z.string()
  }).array().optional(),
  dependencies: z.nativeEnum(TaskDependenciesEnum),
  milestoneIndicator: z.boolean(),
  flag: z.string().optional(),
});

export const updateTaskSchema = z.object({
  taskName: z.string().min(1).optional(),
  taskDescription: z.string().min(1).optional(),
  startDate: z.string().min(1).optional(),
  duration: z.number().nonnegative().optional(),
  completionPecentage: z.string().optional(),
  status: z.nativeEnum(TaskStatusEnum).optional(),
  assignee: z.string().uuid().optional(),
  dependencies: z.nativeEnum(TaskDependenciesEnum).optional(),
  milestoneIndicator: z.boolean().optional().or(z.boolean()),
  flag: z.string().min(1).optional(),
});


export const taskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatusEnum)
});
export const commentIdSchma = z.string().uuid();

export const createCommentTaskSchema = z.object({
  commentText: z.string(),
});

export const attachmentIdSchma = z.string().uuid();

export const attachmentTaskSchema = z.object({
  attachmentId: z.string().uuid().optional(),
  name: z.string(),
  url: z.string()
}).array();