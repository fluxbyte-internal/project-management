import { ProjectDefaultViewEnum, ProjectStatusEnum } from "@prisma/client";
import { z } from "zod";


export const createProjectSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string(),
  startDate: z.coerce.date(),
  estimatedEndDate: z.coerce.date(),
  estimatedBudget: z.string(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnum)
});

export const updateProjectSchema = z.object({
  projectName: z.string().min(1).optional(),
  projectDescription: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  estimatedEndDate: z.coerce.date().optional(),
  estimatedBudget: z.string().min(1).optional(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnum).optional(),
  progressionPercentage: z.string().min(1).optional(),
  actualCost: z.string().min(1).optional(),
  budgetTrack: z.string().min(1).optional(),
  timeTrack: z.string().min(1).optional()

});

export const projectIdSchema = z.string().uuid();

export const projectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatusEnum)
});