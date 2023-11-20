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
  projectName: z.string().nullish(),
  projectDescription: z.string().nullish(),
  startDate: z.string().nullish(),
  estimatedEndDate: z.string().nullish(),
  estimatedBudget: z.string().nullish(),
  defaultView: z.nativeEnum(ProjectDefaultViewEnum).nullish(),
  progressionPercentage: z.string().nullish(),
  actualCost: z.string().nullish(),
  budgetTrack: z.string().nullish(),
  timeTrack: z.string().nullish(),
  actualEndDate: z.string().nullish()
});

export const projectIdSchema = z.string().uuid();