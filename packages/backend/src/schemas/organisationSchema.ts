import { OrgStatusEnum } from "@prisma/client";
import { z } from "zod";

export enum OrgListOfNonWorkingDaysEnum {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN"
};

export const organisationIdSchema = z.string().uuid();

export const createOrganisationSchema = z.object({
  organisationName: z.string().min(1),
  industry: z.string().min(1),
  status: z.nativeEnum(OrgStatusEnum),
  country: z.string().min(1),
  nonWorkingDays: z.nativeEnum(OrgListOfNonWorkingDaysEnum).array()
});

export const updateOrganisationSchema = z.object({
  organisationName: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
  status: z.nativeEnum(OrgStatusEnum).optional(),
  country: z.string().min(1).optional(),
  nonWorkingDays: z.nativeEnum(OrgListOfNonWorkingDaysEnum).array().optional()
});