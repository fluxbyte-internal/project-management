import { z } from "zod";
import { OverAllTrackEnumValue, ScheduleAndBudgetTrend, ProjectDefaultViewEnumValue, ProjectStatusEnumValue, ZodErrorMessageEnumValue } from "./enums.js";


export const createProjectSchema = z.object({
  projectName: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  projectDescription: z.string().optional(),
  startDate: z.coerce.date({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  estimatedEndDate: z.coerce.date({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  estimatedBudget: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  defaultView: z.nativeEnum(ProjectDefaultViewEnumValue,{required_error:ZodErrorMessageEnumValue.REQUIRED}),
  currency: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
});

export const updateProjectSchema = z.object({
  projectName: z.string().min(1).optional(),
  projectDescription: z.string().optional(),
  startDate: z.coerce.date().optional(),
  estimatedEndDate: z.coerce.date().optional(),
  estimatedBudget: z.string().min(1).optional(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnumValue).optional(),
  progressionPercentage: z.string().min(1).optional(),
  actualCost: z.string().min(1).optional(),
  budgetTrack: z.string().min(1).optional(),
  timeTrack: z.string().min(1).optional(),
  currency: z.string().min(1).optional(),
  overallTrack: z.nativeEnum(OverAllTrackEnumValue).optional(),
  status: z.nativeEnum(ProjectStatusEnumValue).optional(),
  scheduleTrend: z.nativeEnum(ScheduleAndBudgetTrend).optional(),
  budgetTrend: z.nativeEnum(ScheduleAndBudgetTrend).optional(),
  consumedBudget: z.string().min(1).optional()
});

export const projectIdSchema = z.string().uuid();

export const projectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatusEnumValue),
});

export const createKanbanSchema = z.object({
  name: z.string({ required_error: ZodErrorMessageEnumValue.REQUIRED }),
  percentage: z.number().min(0).max(100).multipleOf(0.01),
});

export const updateKanbanSchema = z.object({
  name: z.string({ required_error: ZodErrorMessageEnumValue.REQUIRED }),
  percentage: z.number().min(0).max(100).multipleOf(0.01).optional(),
});

export const consumedBudgetSchema = z.object({
  consumedBudget: z.string({
    required_error: ZodErrorMessageEnumValue.REQUIRED,
  }),
});
