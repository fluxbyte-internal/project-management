import express from 'express';
import { Prisma, UserStatusEnum } from "@prisma/client";
import bcrypt from 'bcrypt';
import { STATUS_CODES } from '../constants/constants.js';
import { sendResponse } from '../config/helper.js';
import jwt from 'jsonwebtoken';
import { getClientByTenantId } from '../config/db.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';


const privateKey = process.env.PRIVATE_KEY_FOR_JWT ?? 'Fluxbyte@7';
const saltRounds = 10;

export const signUp = async (req: express.Request, res: express.Response) => {
  const { email, password }: Prisma.UserCreateInput = req.body;
  if (!email) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please provide Email!');
  if (!password) return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Please provide Password!');
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const prisma = await getClientByTenantId(req.tenantId);
    const user = await prisma?.user.create({
      data: {
        email: email,
        password: hashedPassword,
        status: UserStatusEnum.ACTIVE,
      }
    });
    if (user) {
      const token = jwt.sign(
        { userId: user.userId, email: email, tenantId: req.tenantId ?? "root" },
        privateKey,
        { expiresIn: '2 days', algorithm: 'HS256' }
      );
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
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user.userId, email: email, tenantId: req.tenantId ?? 'root' },
        privateKey,
        { expiresIn: '2 days', algorithm: 'HS256' }
      );
      return sendResponse(res, STATUS_CODES.OK, 'Login successfully', { user, token });
    }
    return sendResponse(res, STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
  } catch (error) {
    return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, 'Something went wrong')
  }
};