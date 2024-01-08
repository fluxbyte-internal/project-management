import express from "express";
import { getClientByTenantId } from "../config/db.js";
import { BadRequestError, SuccessResponse } from "../config/apiError.js";
import { StatusCodes } from "http-status-codes";
import { uuidSchema } from "../schemas/commonSchema.js";

export const getAllNotification = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const notifications = await prisma.notification.findMany({
    where: {
      sentTo: req.userId,
      isRead: false,
    },
    include: {
      sentNotificationBy: {
        select: {
          avatarImg: true,
          country: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      sentNotificationTo: {
        select: {
          avatarImg: true,
          country: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      task: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    notifications,
    "Notifications get successfully"
  ).send(res);
};

export const readNotification = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const notificationId = uuidSchema.parse(req.params.notificationId);
  const prisma = await getClientByTenantId(req.tenantId);

  await prisma.notification.update({
    where: {
      notificationId: notificationId,
    },
    data: {
      isRead: true,
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Notifications read successfully"
  ).send(res);
};
