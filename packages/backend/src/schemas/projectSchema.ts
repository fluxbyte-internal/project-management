import { ProjectDefaultViewEnum } from "@prisma/client";
import { z } from "zod";


export const createProjectSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string(),
  startDate: z.string(),
  estimatedEndDate: z.string(),
  estimatedBudget: z.string(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnum)
});

export const updateProjectSchema = z.object({
  projectName: z.string().min(1).optional(),
  projectDescription: z.string().min(1).optional(),
  startDate: z.string().min(1).optional(),
  estimatedEndDate: z.string().min(1).optional(),
  estimatedBudget: z.string().min(1).optional(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnum).optional(),
  progressionPercentage: z.string().min(1).optional(),
  actualCost: z.string().min(1).optional(),
  budgetTrack: z.string().min(1).optional(),
  timeTrack: z.string().min(1).optional()

});

export const projectIdSchema = z.string().uuid();