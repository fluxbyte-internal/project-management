import { z } from "zod";

export const organisationIdSchema = z.string().uuid();

export const createOrganisationSchema = z.object({
  organisationName: z.string(),
  industry: z.string(),
  status: z.string(),
  country: z.string(),
  listOfNonWorkingDays: z.number()
}); 