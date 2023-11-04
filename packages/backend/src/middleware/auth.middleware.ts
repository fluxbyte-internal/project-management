import express from 'express';
import { sendResponse } from "../config/helper.js";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { STATUS_CODES } from '../constants/constants.js';

const privateKey = process.env.PRIVATE_KEY_FOR_JWT ?? 'Fluxbyte@7';

interface MyJwtPayload extends JwtPayload {
  userId: string;
  tenantId: string
};


export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers["authorization"];
  try {
    if (!token) {
      return sendResponse(res, STATUS_CODES.UNAUTHORISED, 'Please provide token!!');
    };
    const tokenWithoutBearer = token.slice(7);
    const decoded = jwt.verify(tokenWithoutBearer, privateKey) as MyJwtPayload;
    req.userId = decoded.userId;
    req.tenantId = decoded.tenantId;
    next()
  } catch (error: unknown | any) {
    console.log(error);
    if (error.name === 'JsonWebTokenError') {
      return sendResponse(res, STATUS_CODES.UNAUTHORISED, 'Unauthorised!!');
    };
    return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};