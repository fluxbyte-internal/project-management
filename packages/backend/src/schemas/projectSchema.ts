import { z } from "zod";
import { OverAllTrackEnumValue, ScheduleAndBudgetTrend, ProjectDefaultViewEnumValue, ProjectStatusEnumValue, ZodErrorMessageEnumValue } from "./enums.js";
import { UserRoleEnum } from "@prisma/client";


export const createProjectSchema = z.object({
  projectName: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  projectDescription: z.string().optional(),
  startDate: z.coerce.date({required_error:ZodErrorMessageEnumValue.REQUIRED}),
  estimatedEndDate: z.coerce.date().optional(),
  estimatedBudget: z.string().optional(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnumValue,{required_error:ZodErrorMessageEnumValue.REQUIRED}),
  currency: z.string({required_error:ZodErrorMessageEnumValue.REQUIRED}),
}).refine(data => {
  if (data.estimatedEndDate) {
    return new Date(data.estimatedEndDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: 'End date precedes start date.',
  path: ['estimatedEndDate'] 
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
}).refine(data => {
  return new Date(data?.estimatedEndDate ?? new Date()) >= new Date(data.startDate?? new Date());
}, {
  message: 'End date precedes start date.',
  path: ['estimatedEndDate'] 
});

export const projectIdSchema = z.string().uuid();

export const projectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatusEnumValue),
});

export const createKanbanSchema = z.object({
  name: z.string({ required_error: ZodErrorMessageEnumValue.REQUIRED }),
  percentage: z.number().nullish()
}).refine((data) => {
  if (data.percentage !== undefined && data.percentage && data.percentage > 100) {
    return [{ field: "percentage", message: "Percentage should not exceed 100" }];
  }
  return true;
});

export const updateKanbanSchema = z.object({
  name: z.string({ required_error: ZodErrorMessageEnumValue.REQUIRED }),
  percentage:  z.number().nullish()
}).refine((data) => {
  if (data.percentage !== undefined && data.percentage && data.percentage > 100) {
    return [{ field: "percentage", message: "Percentage should not exceed 100" }];
  }
  return true;
});;

export const consumedBudgetSchema = z.object({
  consumedBudget: z.string({
    required_error: ZodErrorMessageEnumValue.REQUIRED,
  }),
});

export const projectAssginedRole = z.object({
  role: z.nativeEnum(UserRoleEnum)
});

export const assginedUserProjectSchema = z.object({
  assginedToUserId: z.string().uuid(),
  // projectRoleForUser: z.nativeEnum(UserRoleEnum)
});