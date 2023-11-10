import { z } from "zod";
import { OrganisationStatusEnum } from "@prisma/client";

export const organisationIdSchema = z.string().uuid();

export const createOrganisationSchema = z.object({
  organisationName: z.string(),
  industry: z.string(),
  status: z.nativeEnum(OrganisationStatusEnum),
  country: z.string(),
  listOfNonWorkingDays: z.number()
}); 