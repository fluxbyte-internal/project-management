import { ZodError, z } from "zod";
import { TaskDependenciesEnumValue, TaskStatusEnumValue } from "./enums.js";
export const createTaskSchema = z.object({
  taskName: z.string().min(1),
  taskDescription: z.string().optional(),
  startDate: z.coerce.date(),
  duration: z.number().multipleOf(0.01)
});
export const updateTaskSchema = z.object({
  taskName: z.string().min(1).optional(),
  taskDescription: z.string().optional(),
  startDate: z.coerce.date().optional(),
  duration: z.number().multipleOf(0.01).optional(),
  completionPecentage: z.string().optional(),
  status: z.nativeEnum(TaskStatusEnumValue).optional(),
});

export const assginedToUserIdSchema = z.object({
  assginedToUserId: z.string().uuid(),
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
    dependentType: z.nativeEnum(TaskDependenciesEnumValue),
    dependendentOnTaskId: z
      .string({ required_error: "Task required*" })
      .uuid()
  })
  .refine((data) => {
    const { dependentType, dependendentOnTaskId } = data;
    if (
      (dependentType === TaskDependenciesEnumValue.BLOCKING ||
        dependentType === TaskDependenciesEnumValue.WAITING_ON) &&
      !dependendentOnTaskId
    ) {
      throw new ZodError([
        {
          code: "invalid_string",
          message:
            "Dependant Task should not be null when dependentType provided",
          path: ["dependendentOnTaskId"],
          validation: "uuid",
        },
      ]);
    } else if (
      dependendentOnTaskId &&
      dependentType != TaskDependenciesEnumValue.WAITING_ON &&
      dependentType != TaskDependenciesEnumValue.BLOCKING
    ) {
      throw new ZodError([
        {
          code: "invalid_string",
          message: `Dependant Task should be null when dependentType provided`,
          path: ["dependentType"],
          validation: "uuid",
        },
      ]);
    }
    return true;
  });

export const milestoneTaskSchema = z
  .object({
    milestoneIndicator: z.boolean(),
    dueDate: z.coerce.date().optional(),
  })
  .refine((data) => {
    const { milestoneIndicator, dueDate } = data;
    if (milestoneIndicator && !dueDate) {
      throw new ZodError([
        {
          code: "invalid_date",
          message: "Due Date should not be null when milestone provided",
          path: ["dueDate"],
        },
      ]);
    } else if (milestoneIndicator && dueDate && dueDate <= new Date()) {
      throw new ZodError([
        {
          code: "invalid_date",
          message: `Due date should be in the future when milestone provided`,
          path: ["dueDate"],
        },
      ]);
    }
    return true;
  });
