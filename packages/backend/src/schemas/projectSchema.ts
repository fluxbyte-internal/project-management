import { z } from "zod";


export const createProjectSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string(),
  timeTrack: z.string().nullable(),
  startDate: z.string(),
  estimatedEndDate: z.string().nullable(),
  actualEndDate: z.string().nullable(),
  budgetTrack: z.string().nullable(),
  estimatedBudget: z.string().nullable(),
  actualCost: z.string().nullable(),
});

export const projectIdSchema = z.string().uuid();