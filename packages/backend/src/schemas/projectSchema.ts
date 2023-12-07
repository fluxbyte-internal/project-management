import { z } from "zod";
import { ProjectDefaultViewEnumValue, ProjectStatusEnumValue } from "./enums.js";


export const createProjectSchema = z.object({
  projectName: z.string({required_error:"Required*"}),
  projectDescription: z.string({required_error:"Required*"}),
  startDate: z.coerce.date({required_error:"Required*"}),
  estimatedEndDate: z.coerce.date({required_error:"Required*"}),
  currency:z.string({required_error:"Required*"}),
  estimatedBudget: z.string({required_error:"Required*"}),
  defaultView: z.nativeEnum(ProjectDefaultViewEnumValue,{required_error:"Required*"})
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
  timeTrack: z.string().min(1).optional()
});

export const projectIdSchema = z.string().uuid();

export const projectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatusEnumValue)
});