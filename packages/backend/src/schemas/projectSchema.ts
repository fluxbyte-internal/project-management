import { z } from "zod";
import { OverAllTrackEnumValue, ProjectDefaultViewEnumValue, ProjectStatusEnumValue, TaskStatusEnumValue, ZodErrorMessageEnumValue } from "./enums.js";


export const createProjectSchema = z.object({
  projectName: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  projectDescription: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  startDate: z.coerce.date({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  estimatedEndDate: z.coerce.date({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  estimatedBudget: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  defaultView: z.nativeEnum(ProjectDefaultViewEnumValue,{required_error:ZodErrorMessageEnumValue.REQUIRED}),
  currency: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
});

export const updateProjectSchema = z.object({
  projectName: z.string().min(1).optional(),
  projectDescription: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  estimatedEndDate: z.coerce.date().optional(),
  estimatedBudget: z.string().min(1).optional(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnumValue).optional(),
  progressionPercentage: z.string().min(1).optional(),
  actualCost: z.string().min(1).optional(),
  budgetTrack: z.string().min(1).optional(),
  timeTrack: z.string().min(1).optional(),
  currency: z.string().min(1).optional(),
  overallTrack:z.nativeEnum(OverAllTrackEnumValue).optional(),
  status:z.nativeEnum(ProjectStatusEnumValue).optional()
});

export const projectIdSchema = z.string().uuid();

export const projectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatusEnumValue),
});
