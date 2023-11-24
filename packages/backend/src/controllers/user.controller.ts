import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';


export const me = async (req: express.Request, res: express.Response) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.findUnique({
    where: { userId: req.userId },
    include: {
      userOrganisation: { include: { organisation: true }}
    }
  });
  if (!user) throw new NotFoundError('User not found!');
  const { password, ...userInfoWithoutPassword } = user;
  return new SuccessResponse(StatusCodes.OK, userInfoWithoutPassword, 'Login user details').send(res);
};