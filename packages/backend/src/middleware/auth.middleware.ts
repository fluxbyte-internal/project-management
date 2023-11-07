import express from 'express';
import { verifyJwtToken } from '../utils/jwtHelper.js';
import { ErrorResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers["authorization"];
  try {
    if (!token) {
      return new ErrorResponse(StatusCodes.UNAUTHORIZED, 'Please provide token!!').send(res);
    };
    const decoded = verifyJwtToken(token.replace('Bearer ', ''));
    req.userId = decoded.userId;
    req.tenantId = decoded.tenantId;
    next()
  } catch (error: unknown | any) {
    console.log(error);
    if (error.name === 'JsonWebTokenError') {
      return new ErrorResponse(StatusCodes.UNAUTHORIZED, 'Unauthorised!!').send(res);
    };
    return new ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error').send(res);
  }
};