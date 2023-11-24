import { z } from "zod";
import { TaskDependenciesEnumValue, TaskStatusEnumValue } from "./enums.js";


export const taskIdSchema = z.string().uuid();

export const createTaskSchema = z.object({
  taskName: z.string(),
  taskDescription: z.string().optional(),
  startDate: z.coerce.date(),
  duration: z.number(),
  assginedToUserId: z.string().uuid(),
  documentAttachments: z.object({
    name: z.string(),
    url: z.string()
  }).array().optional(),
  dependencies: z.nativeEnum(TaskDependenciesEnumValue),
  milestoneIndicator: z.boolean(),
  flag: z.string().optional(),
});

export const updateTaskSchema = z.object({
  taskName: z.string().min(1).optional(),
  taskDescription: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  duration: z.number().nonnegative().optional(),
  completionPecentage: z.string().optional(),
  status: z.nativeEnum(TaskStatusEnumValue).optional(),
  assginedToUserId: z.string().uuid().optional(),
  dependencies: z.nativeEnum(TaskDependenciesEnumValue).optional(),
  milestoneIndicator: z.boolean().optional(),
  flag: z.string().min(1).optional(),
});


export const taskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatusEnumValue)
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