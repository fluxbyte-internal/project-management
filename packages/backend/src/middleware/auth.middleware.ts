import express from 'express';
import { verifyJwtToken } from '../utils/jwtHelper.js';
import { InternalServerError, UnAuthorizedError } from '../config/apiError.js';

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers["authorization"];
  try {
    if (!token) {
      throw new UnAuthorizedError();
    };
    const decoded = verifyJwtToken(token.replace('Bearer ', ''));
    req.userId = decoded.userId;
    req.tenantId = decoded.tenantId;
    next()
  } catch (error: unknown | any) {
    console.log(error);
    if (error.name === 'JsonWebTokenError') {
      throw new UnAuthorizedError();
    };
    throw new InternalServerError('Internal server error');
  }
};