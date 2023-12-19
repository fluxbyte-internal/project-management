import { ZodError, z } from "zod";
import { TaskDependenciesEnumValue, TaskStatusEnumValue } from "./enums.js";
export const createTaskSchema = z.object({
  taskName: z.string(),
  taskDescription: z.string().optional(),
  startDate: z.coerce.date(),
  duration: z.number(),
  milestoneIndicator: z.boolean(),
});
export const updateTaskSchema = z.object({
  taskName: z.string().min(1).optional(),
  taskDescription: z.string().optional(),
  startDate: z.coerce.date().optional(),
  duration: z.number().nonnegative().optional(),
  completionPecentage: z.string().optional(),
  status: z.nativeEnum(TaskStatusEnumValue).optional(),
  assginedToUserId: z.string().uuid().array().optional(),
  milestoneIndicator: z.boolean().optional(),
});
export const assginedToUserIdSchema = z.object({
  assginedToUserId: z.string().uuid()
});
export const taskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatusEnumValue),
});
export const createCommentTaskSchema = z.object({
  commentText: z.string(),
});
export const attachmentTaskSchema = z.any();
export const dependenciesTaskSchema = z
  .object({
    dependencies: z.nativeEnum(TaskDependenciesEnumValue),
    dependantTaskId: z
      .string({ required_error: "Task required*" })
      .uuid()
      .nullable(),
  })
  .refine((data) => {
    const { dependencies, dependantTaskId } = data;
    if (
      (dependencies === TaskDependenciesEnumValue.BLOCKING ||
        dependencies === TaskDependenciesEnumValue.WAITING_ON) &&
      !dependantTaskId
    ) {
      throw new ZodError([
        {
          code: "invalid_string",
          message:
            "Dependant Task should not be NO_DEPENDENCIES when dependencies provided",
          path: ["dependantTaskId"],
          validation: "uuid",
        },
      ]);
    } else if (
      dependantTaskId &&
      dependencies != "WAITING_ON" &&
      dependencies != "BLOCKING"
    ) {
      throw new ZodError([
        {
          code: "invalid_string",
          message: `Dependant Task should be NO_DEPENDENCIES when dependencies provided`,
          path: ["dependencies"],
          validation: "uuid",
        },
      ]);
    } else if (
      dependencies === TaskDependenciesEnumValue.NO_DEPENDENCIES &&
      dependantTaskId
    ) {
      throw new ZodError([
        {
          code: "invalid_string",
          message: `Dependant Task should be NO_DEPENDENCIES when dependencies is ${dependencies}`,
          path: ["dependencies"],
          validation: "uuid",
        },
      ]);
    }
    return true;
  });
