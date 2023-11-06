import express from 'express';
import { sendResponse } from "../config/helper.js";
import { STATUS_CODES } from '../constants/constants.js';
import { verifyJwtToken } from '../utils/jwtHelper.js';

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers["authorization"];
  try {
    if (!token) {
      return sendResponse(res, STATUS_CODES.UNAUTHORISED, 'Please provide token!!');
    };
    const decoded = verifyJwtToken(token.replace('Bearer ', ''));
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