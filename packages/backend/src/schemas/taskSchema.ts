import { ZodError, z } from "zod";
import {
  TaskDependenciesEnumValue,
  TaskStatusEnumValue,
  ZodErrorMessageEnumValue,
} from "./enums.js";

export const createTaskSchema = z
  .object({
    taskName: z.string({ required_error: ZodErrorMessageEnumValue.REQUIRED }),
    taskDescription: z
      .string({ required_error: ZodErrorMessageEnumValue.REQUIRED })
      .optional(),
    startDate: z.coerce.date({
      required_error: ZodErrorMessageEnumValue.REQUIRED,
    }),
    duration: z.number({ required_error: ZodErrorMessageEnumValue.REQUIRED }),
    dependencies: z.nativeEnum(TaskDependenciesEnumValue).optional(),
    dependantTaskId: z.string().uuid().optional(),
    milestoneIndicator: z.boolean({
      required_error: ZodErrorMessageEnumValue.REQUIRED,
    }),
  })
  .refine((data) => {
    const { dependencies, dependantTaskId } = data;
    if (dependencies && !dependantTaskId) {
      throw new ZodError([
        {
          code: "invalid_string",
          message:
            "dependantTaskId should not be null when dependencies provided",
          path: ["dependantTaskId"],
          validation: "uuid",
        },
      ]);
    } else if (!dependencies && dependantTaskId) {
      throw new ZodError([
        {
          code: "invalid_string",
          message:
            "dependencies should not be null when dependantTaskId provided",
          path: ["dependencies"],
          validation: "uuid",
        },
      ]);
    }
    return true;
  });

export const updateTaskSchema = z
  .object({
    taskName: z.string().min(1).optional(),
    taskDescription: z.string().min(1).optional(),
    startDate: z.coerce.date().optional(),
    duration: z.number().nonnegative().optional(),
    completionPecentage: z.string().optional(),
    status: z.nativeEnum(TaskStatusEnumValue).optional(),
    assginedToUserId: z.string().uuid().array().optional(),
    dependencies: z.nativeEnum(TaskDependenciesEnumValue).optional(),
    dependantTaskId: z.string().uuid().optional(),
    milestoneIndicator: z.boolean().optional(),
  })
  .refine((data) => {
    const { dependencies, dependantTaskId } = data;
    if (dependencies && !dependantTaskId) {
      throw new ZodError([
        {
          code: "invalid_string",
          message:
            "dependantTaskId should not be null when dependencies provided",
          path: ["dependantTaskId"],
          validation: "uuid",
        },
      ]);
    } else if (!dependencies && dependantTaskId) {
      throw new ZodError([
        {
          code: "invalid_string",
          message:
            "dependencies should not be null when dependantTaskId provided",
          path: ["dependencies"],
          validation: "uuid",
        },
      ]);
    }
    return true;
  });

export const addMemberToTaskSchema = z.object({
  assginedToUserId: z.string().uuid(),
  taskId: z.string().uuid(),
});

export const taskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatusEnumValue),
});

export const createCommentTaskSchema = z.object({
  commentText: z.string(),
});

export const attachmentTaskSchema = z.any();
