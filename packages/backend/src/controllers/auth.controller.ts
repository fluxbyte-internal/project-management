import express from 'express';
import { Prisma, UserStatusEnum } from "@prisma/client";
import { STATUS_CODES } from '../constants/constants.js';
import { sendResponse } from '../config/helper.js';
import { getClientByTenantId } from '../config/db.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';
import { settings } from '../config/settings.js';
import { createJwtToken, verifyJwtToken } from '../utils/jwtHelper.js';
import { compareEncryption, encrypt } from '../utils/encryption.js';



export const signUp = async (req: express.Request, res: express.Response) => {
  const { email, password }: Prisma.UserCreateInput = req.body;
  if (!email) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please provide Email!');
  if (!password) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please provide Password!');
  try {
    const hashedPassword = await encrypt(password);
    const prisma = await getClientByTenantId(req.tenantId);
    const user = await prisma?.user.create({
      data: {
        email: email,
        password: hashedPassword,
        status: UserStatusEnum.ACTIVE,
      }
    });
    if (user) {
      const tokenPayload = { userId: user.userId, email: email, tenantId: req.tenantId ?? "root" };
      const token = createJwtToken(tokenPayload)
      const refreshToken = createJwtToken(tokenPayload, true)
      res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
      return sendResponse(res, STATUS_CODES.CREATED, 'Sign up successfully', { user, token });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT) {
        return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'User with given email exists');
      }
    }
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  const { email, password }: Prisma.UserCreateInput = req.body;
  if (!email) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please provide Email!');
  if (!password) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please provide Password!');
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const user = await prisma?.user.findUnique({
      where: { email },
    });
    if (user && await compareEncryption(password, user.password)) {
      const tokenPayload = { userId: user.userId, email: email, tenantId: req.tenantId ?? 'root' };
      const token = createJwtToken(tokenPayload)
      const refreshToken = createJwtToken(tokenPayload, true)
      res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
      return sendResponse(res, STATUS_CODES.OK, 'Login successfully', { user, token });
    }
    return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
  } catch (error) {
    return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
};

export const getAccessToken = (req: express.Request, res: express.Response) => {
  const refreshTokenCookie = req.cookies?.refreshToken;
  if (!refreshTokenCookie) { return sendResponse(res, STATUS_CODES.UNAUTHORISED, 'Failed to authenticate') }

  const decoded = verifyJwtToken(refreshTokenCookie);
  const tokenPayload = { userId: decoded.userId, email: decoded.email, tenantId: decoded.tenantId };
  const token = createJwtToken(tokenPayload)
  const refreshToken = createJwtToken(tokenPayload, true)

  res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
  return sendResponse(res, STATUS_CODES.OK, 'Access token retrived successfully', { token });
};