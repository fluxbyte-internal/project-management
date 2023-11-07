import express from 'express';
import { UserStatusEnum } from "@prisma/client";
import { getClientByTenantId } from '../config/db.js';
import { settings } from '../config/settings.js';
import { createJwtToken, verifyJwtToken } from '../utils/jwtHelper.js';
import { compareEncryption, encrypt } from '../utils/encryption.js';
import { ErrorResponse, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { authLoginSchema, authRefreshTokenSchema, authSignUpSchema } from '../schemas/authSchema.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';



export const signUp = async (req: express.Request, res: express.Response) => {
  const { email, password } = authSignUpSchema.parse(req.body);
  const hashedPassword = await encrypt(password);
  const prisma = await getClientByTenantId(req.tenantId);
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        status: UserStatusEnum.ACTIVE,
      }
    });
    const tokenPayload = { userId: user.userId, email: email, tenantId: req.tenantId ?? "root" };
    const token = createJwtToken(tokenPayload)
    const refreshToken = createJwtToken(tokenPayload, true)
    res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
    return new SuccessResponse(StatusCodes.CREATED, { user, token }, 'Sign up successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT) {
        return new ErrorResponse(StatusCodes.BAD_REQUEST, 'User with given email exists').send(res);
      }
    }
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  const { email, password } = authLoginSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && await compareEncryption(password, user.password)) {
    const tokenPayload = { userId: user.userId, email: email, tenantId: req.tenantId ?? 'root' };
    const token = createJwtToken(tokenPayload)
    const refreshToken = createJwtToken(tokenPayload, true)
    res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
    return new SuccessResponse(StatusCodes.OK, { user, token }, 'Login successfully').send(res);
  }
  return new SuccessResponse(StatusCodes.BAD_REQUEST, 'Invalid credentials').send(res);
};

export const getAccessToken = (req: express.Request, res: express.Response) => {
  const refreshTokenCookie = authRefreshTokenSchema.parse(req.cookies['refresh-token']);

  const decoded = verifyJwtToken(refreshTokenCookie);
  const tokenPayload = { userId: decoded.userId, email: decoded.email, tenantId: decoded.tenantId };
  const token = createJwtToken(tokenPayload)
  const refreshToken = createJwtToken(tokenPayload, true)

  res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
  return new SuccessResponse(StatusCodes.OK, { token }, 'Access token retrived successfully').send(res);
};