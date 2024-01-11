import express from "express";
import { getClientByTenantId } from "../config/db.js";
import { UserRoleEnum } from "@prisma/client";
import { BadRequestError, UnAuthorizedError } from "../config/apiError.js";

export const roleMiddleware = (allowedRoles: string[]) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.userId) {
      throw new BadRequestError("userId not found!!");
    }
    const prisma = await getClientByTenantId(req.tenantId);
    const userRoles = await prisma.user.getUserRoles(req.userId);
    const hasAccess = allowedRoles.some((role) =>
      userRoles.includes(role as UserRoleEnum)
    );
    if (!hasAccess) {
      throw new UnAuthorizedError();
    }
    next();
  };
};
