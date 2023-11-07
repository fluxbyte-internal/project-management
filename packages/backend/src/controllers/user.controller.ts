import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';


export const me = async (req: express.Request, res: express.Response) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.findUnique({
    where: { userId: req.userId },
  });
  return new SuccessResponse(StatusCodes.OK, user, 'Login user details').send(res);
};