import express from "express";
import { getClientByTenantId } from "../config/db.js";
import { NotFoundError, SuccessResponse } from "../config/apiError.js";
import { StatusCodes } from "http-status-codes";
import {
  userUpdateSchema,
  userOrgSettingsUpdateSchema,
} from "../schemas/userSchema.js";
import { uuidSchema } from "../schemas/commonSchema.js";

export const me = async (req: express.Request, res: express.Response) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.findUnique({
    where: { userId: req.userId },
    include: {
      userOrganisation: { include: { organisation: true } },
    },
  });
  if (!user) throw new NotFoundError("User not found!");
  const { password, ...userInfoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    userInfoWithoutPassword,
    "Login user details"
  ).send(res);
};

export const updateUserProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const userDataToUpdate = userUpdateSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.update({
    data: {
      ...userDataToUpdate,
    },
    where: { userId: req.userId },
  });
  const { password, ...userInfoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    userInfoWithoutPassword,
    "User profile updated"
  ).send(res);
};

export const updateUserOrganisationSettings = async (
  req: express.Request,
  res: express.Response
) => {
  const userOrgSettingsData = userOrgSettingsUpdateSchema.parse(req.body);
  const userOrganisationId = uuidSchema.parse(req.params.userOrganisationId);
  const prisma = await getClientByTenantId(req.tenantId);
  await prisma.userOrganisation.update({
    data: {
      ...userOrgSettingsData,
    },
    where: { userOrganisationId, userId: req.userId },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "User organisation settings updated"
  ).send(res);
};
