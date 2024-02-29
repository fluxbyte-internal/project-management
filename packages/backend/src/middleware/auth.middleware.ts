import express from 'express';
import { verifyJwtToken } from '../utils/jwtHelper.js';
import { BadRequestError, InternalServerError, UnAuthorizedError } from '../config/apiError.js';
import { settings } from '../config/settings.js';

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies[settings.jwt.tokenCookieKey] 
  if (!token) {
    throw new UnAuthorizedError();
  };
  try {
    const decoded = verifyJwtToken(token);
    req.userId = decoded.userId;
    if(!req.userId){
      throw new BadRequestError("userId not found!!");
    }
    req.tenantId = decoded.tenantId;
    next()
  } catch (error: unknown | any) {
    console.error(error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnAuthorizedError();
    };
    if(error.type === "Bad Request") {
      throw new BadRequestError("userId not found!!");
    }
    throw new InternalServerError('Internal server error');
  }
};