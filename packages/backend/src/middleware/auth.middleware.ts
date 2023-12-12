import express from 'express';
import { verifyJwtToken } from '../utils/jwtHelper.js';
import { InternalServerError, UnAuthorizedError } from '../config/apiError.js';
import { settings } from '../config/settings.js';

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies[settings.jwt.tokenCookieKey];
  try {
    if (!token) {
      throw new UnAuthorizedError();
    };
    const decoded = verifyJwtToken(token.replace('Bearer ', ''));
    req.userId = decoded.userId;
    req.tenantId = decoded.tenantId;
    next()
  } catch (error: unknown | any) {
    console.error(error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnAuthorizedError();
    };
    throw new InternalServerError('Internal server error');
  }
};