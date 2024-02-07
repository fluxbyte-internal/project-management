import { z } from "zod";
import { OrgStatusEnumValue, UserRoleEnumValue, ZodErrorMessageEnumValue } from "./enums.js";

export enum OrgListOfNonWorkingDaysEnum {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN",
}

export const organisationIdSchema = z.string().uuid();

export const createOrganisationSchema = z.object({
  organisationName: z.string().min(1),
  industry: z.string().min(1),
  status: z.nativeEnum(OrgStatusEnumValue),
  country: z.string().min(1),
  nonWorkingDays: z.nativeEnum(OrgListOfNonWorkingDaysEnum).array().min(1,{message:ZodErrorMessageEnumValue.REQUIRED})
});

export const updateOrganisationSchema = z.object({
  organisationName: z.string().min(1).optional(),
  industry: z.string().min(1).optional(),
  status: z.nativeEnum(OrgStatusEnumValue).optional(),
  country: z.string().min(1).optional(),
  nonWorkingDays: z.nativeEnum(OrgListOfNonWorkingDaysEnum).array().optional(),
});


export const addOrganisationMemberSchema = z.object({
  email: z.string().email({ message: "Email is not valid" }),
  role: z.nativeEnum(UserRoleEnumValue).refine(
    (value) => {
      return (
        value in UserRoleEnumValue &&
        (value === UserRoleEnumValue.TEAM_MEMBER ||
          value === UserRoleEnumValue.PROJECT_MANAGER)
      );
    },
    {
      message: "Only team member and project manager role allowed",
    }
  ),
});

export const organisationStatuSchema = z.object({
  status: z.nativeEnum(OrgStatusEnumValue),
});

export const memberRoleSchema = z.object({
  role: z.nativeEnum(UserRoleEnumValue).refine(
    (value) => {
      return (
        value in UserRoleEnumValue &&
        (value === UserRoleEnumValue.PROJECT_MANAGER ||
          value === UserRoleEnumValue.TEAM_MEMBER)
      );
    },
    {
      message: "Only team member and project manager roles are allowed",
    }
  ),
});

export const reAssginedTaskSchema = z.object({
  oldUserId: z.string().uuid(),
  newUserId: z.string().uuid(),
});

