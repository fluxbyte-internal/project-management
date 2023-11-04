import express from 'express';
import { STATUS_CODES } from '../constants/constants.js';
import { sendResponse } from '../config/helper.js';
import { getClientByTenantId } from '../config/db.js';


export const me = async (req: express.Request, res: express.Response) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma?.user.findUnique({
    where: { userId: req.userId },
  });
  return sendResponse(res, STATUS_CODES.OK, 'Login user details', user);
};