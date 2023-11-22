import express from 'express';
import { UserStatusEnum } from "@prisma/client";
import { getClientByTenantId } from '../config/db.js';
import { settings } from '../config/settings.js';
import { createJwtToken, verifyJwtToken } from '../utils/jwtHelper.js';
import { compareEncryption, encrypt } from '../utils/encryption.js';
import { BadRequestError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { authLoginSchema, authRefreshTokenSchema, authSignUpSchema } from '../schemas/authSchema.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';



export const signUp = async (req: express.Request, res: express.Response) => {
  const { email, password } = authSignUpSchema.parse(req.body);
  try {
    const hashedPassword = await encrypt(password);
    const prisma = await getClientByTenantId(req.tenantId);
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
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT) {
        throw new BadRequestError('User with given email exists');
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
    const { password, ...userInfoWithoutPassword } = user;

    return new SuccessResponse(StatusCodes.OK, { user: userInfoWithoutPassword, token }, 'Login successfully').send(res);
  }
  throw new BadRequestError('Invalid credentials');
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