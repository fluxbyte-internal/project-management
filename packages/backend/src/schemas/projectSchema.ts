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
  projectName: z.string().min(1).optional().or(z.string().nonempty()),
  projectDescription: z.string().min(1).optional().or(z.string().nonempty()),
  startDate: z.string().min(1).optional().or(z.string().nonempty()),
  estimatedEndDate: z.string().min(1).optional().or(z.string().nonempty()),
  estimatedBudget: z.string().min(1).optional().or(z.string().nonempty()),
  defaultView: z.nativeEnum(ProjectDefaultViewEnum).optional().or(z.nativeEnum(ProjectDefaultViewEnum)),
  progressionPercentage: z.string().min(1).optional().or(z.string().nonempty()),
  actualCost: z.string().min(1).optional().or(z.string().nonempty()),
  budgetTrack: z.string().min(1).optional().or(z.string().nonempty()),
  timeTrack: z.string().min(1).optional().or(z.string().nonempty()),
  actualEndDate: z.string().min(1).optional().or(z.string().nonempty())
});

export const projectIdSchema = z.string().uuid();