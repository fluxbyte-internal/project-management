import express from 'express';
import { UserStatusEnum } from "@prisma/client";
import { getClientByTenantId } from '../config/db.js';
import { settings } from '../config/settings.js';
import { createJwtToken, verifyJwtToken } from '../utils/jwtHelper.js';
import { compareEncryption, encrypt } from '../utils/encryption.js';
import { BadRequestError, InternalServerError, NotFoundError, SuccessResponse, UnAuthorizedError } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { authLoginSchema, authRefreshTokenSchema, authSignUpSchema, verifyEmailOtpSchema } from '../schemas/authSchema.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';
import { ZodError, date } from 'zod';
import { generateOTP } from '../utils/otpHelper.js';
import { EmailService } from '../services/email.services.js';
import { OtpService } from '../services/userOtp.services.js';


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

    const otpValue = generateOTP();
    const subjectMessage = `Login OTP`;
    const expiresInMinutes = 10;
    const bodyMessage = `Here is your login OTP : ${otpValue}, OTP is valid for ${expiresInMinutes} minutes`;
    await OtpService.saveOTP(
      otpValue, user.userId, req.tenantId, expiresInMinutes * 60
    );
    try {
      await EmailService.sendEmail(email, subjectMessage, bodyMessage);
    } catch (error) {
      console.error('Failed to send email', error);
    };
    res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
    const { password: _, ...userInfoWithoutPassword } = user;
    return new SuccessResponse(StatusCodes.CREATED, { user: userInfoWithoutPassword, token }, 'Sign up successfully').send(res);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.UNIQUE_CONSTRAINT) {
        throw new ZodError([{
          code: 'invalid_string',
          message: 'User with given email already exists',
          path: ['email'],
          validation: "email",
        }]);
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
  throw new UnAuthorizedError();
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


export const otpVerify = async (req: express.Request, res: express.Response) => {
  const { otp } = verifyEmailOtpSchema.parse(req.body);
  const checkOtp = await OtpService.verifyOTP(otp, req.userId!, req.tenantId);
  if (!checkOtp) { throw new BadRequestError("Invalid OTP") };
  return new SuccessResponse(StatusCodes.OK, null, 'OTP verified successfully').send(res);
};

export const resendOTP = async (req: express.Request, res: express.Response) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.findFirst({
    where: {
      userId: req.userId
    }
  });
  if (!user) { throw new NotFoundError('User not found') };
  const findOtp = await prisma.userOTP.findFirst({
    where: {
      userId: req.userId,
      createdAt: {
        gt: new Date(Date.now() - 60 * 1000)
      }
    }
  });
  if (findOtp) { throw new BadRequestError('Please try again after 1 minute') };
  const otpValue = generateOTP();
  const subjectMessage = `Login OTP`;
  const expiresInMinutes = 10;
  const bodyMessage = `Here is your login OTP : ${otpValue}, OTP is valid for ${expiresInMinutes} minutes`;
  try {
    await EmailService.sendEmail(user.email, subjectMessage, bodyMessage);
    await OtpService.saveOTP(
      otpValue, user.userId, req.tenantId, expiresInMinutes * 60
    );
  } catch (error) {
    throw new InternalServerError();
  };
  return new SuccessResponse(StatusCodes.OK, null, 'Resend OTP successfully').send(res);
};

export const verifyRoot = (req: express.Request, res: express.Response) => {
  const username = req.body.username;
  const password = req.body.password;
  if (
    username == settings.user.username &&
    password == settings.user.password
  ) {
      return new SuccessResponse(StatusCodes.OK, null, 'Ok').send(res);
  } else {
    throw new BadRequestError();
  };
};
