import { z } from "zod";

export const organisationIdSchema = z.string().uuid();

export const createOrganisationSchema = z.object({
  organisationName: z.string().min(1),
  industry: z.string().min(1),
  status: z.string().min(1),
  country: z.string().min(1),
  listOfNonWorkingDays: z.number()
}); 