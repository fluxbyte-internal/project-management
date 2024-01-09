import express from "express";
import { getClientByTenantId } from "../config/db.js";
import { compareEncryption, encrypt } from "../utils/encryption.js";
import { ConsoleRoleEnum, ConsoleStatusEnum } from "@prisma/client";
import {
  BadRequestError,
  NotFoundError,
  SuccessResponse,
  UnAuthorizedError,
} from "../config/apiError.js";
import { StatusCodes } from "http-status-codes";
import {
  avatarImgConsoleSchema,
  consoleLoginSchema,
  consolePasswordSchema,
  operatorSchema,
  operatorStatusSchema,
  operatorUpdateSchema,
} from "../schemas/consoleSchema.js";
import { createJwtToken } from "../utils/jwtHelper.js";
import { settings } from "../config/settings.js";
import { generateRandomPassword } from "../utils/generateRandomPassword.js";
import { EmailService } from "../services/email.services.js";
import { userStatuSchema } from "../schemas/userSchema.js";
import { uuidSchema } from "../schemas/commonSchema.js";
import { organisationStatuSchema } from "../schemas/organisationSchema.js";
import { ZodError } from "zod";
import { AwsUploadService } from "../services/aws.services.js";

export const me = async (req: express.Request, res: express.Response) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.consoleUser.findUniqueOrThrow({
    where: {
      userId: req.userId,
    },
  });
  if (user?.status === ConsoleStatusEnum.INACTIVE) {
    throw new BadRequestError("User is DEACTIVE");
  }
  const { password, ...infoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    infoWithoutPassword,
    "Login details"
  ).send(res);
};

export const loginConsole = async (
  req: express.Request,
  res: express.Response
) => {
  const { email, password } = consoleLoginSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.consoleUser.findUnique({
    where: { email },
  });
  if (user?.status === ConsoleStatusEnum.INACTIVE) {
    throw new BadRequestError("User is DEACTIVE");
  }
  if (user && (await compareEncryption(password, user.password))) {
    const tokenPayload = {
      userId: user.userId,
      email: email,
      tenantId: req.tenantId ?? "root",
    };
    const token = createJwtToken(tokenPayload);
    const refreshToken = createJwtToken(tokenPayload, true);
    res.cookie(settings.jwt.refreshTokenCookieKey, refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
    });
    const { password, ...infoWithoutPassword } = user;

    return new SuccessResponse(
      StatusCodes.OK,
      { user: infoWithoutPassword, token },
      "Login successfully"
    ).send(res);
  }
  throw new UnAuthorizedError();
};

export const createSuperAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await encrypt(password);
  await prisma.consoleUser.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      status: ConsoleStatusEnum.ACTIVE,
      role: ConsoleRoleEnum.SUPER_ADMIN,
      isVerified: true,
    },
  });
  return new SuccessResponse(
    StatusCodes.CREATED,
    null,
    "Super admin successfully"
  ).send(res);
};

export const createOperator = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const { email, firstName, lastName } = operatorSchema.parse(req.body);
  const randomPassword = generateRandomPassword();
  const hashedPassword = await encrypt(randomPassword);
  const findOperator = await prisma.consoleUser.findUnique({
    where: {
      email: email,
    },
  });
  if (findOperator) {
    throw new ZodError([
      {
        code: "invalid_string",
        message: "Operator already exists",
        path: ["email"],
        validation: "email",
      },
    ]);
  }
  const newUser = await prisma.consoleUser.create({
    data: {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      status: ConsoleStatusEnum.ACTIVE,
      isVerified: true,
      role: ConsoleRoleEnum.OPERATOR,
    },
  });
  try {
    const subjectMessage = `Invited`;
    const bodyMessage = `
      You are invited in console
      
      URL: ${settings.appURL}/login
      PASSWORD: ${randomPassword}
      `;
    await EmailService.sendEmail(newUser.email, subjectMessage, bodyMessage);
  } catch (error) {
    console.error("Failed to send email", error);
  }
  const { password, ...infoWithoutPassword } = newUser;
  return new SuccessResponse(
    StatusCodes.CREATED,
    infoWithoutPassword,
    "Operator created successfully"
  ).send(res);
};

export const getAllOperator = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const operators = await prisma.consoleUser.findMany({
    where: {
      role: {
        in: [ConsoleRoleEnum.OPERATOR],
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    operators,
    "Operators get successfully"
  ).send(res);
};

export const changeOperatorStatus = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const userId = uuidSchema.parse(req.params.userId);
  const prisma = await getClientByTenantId(req.tenantId);
  const statusValue = operatorStatusSchema.parse(req.body);
  const user = await prisma.consoleUser.update({
    data: {
      status: statusValue.status,
    },
    where: { userId: userId },
  });
  const { password, ...infoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    infoWithoutPassword,
    "Operator status updated successfully"
  ).send(res);
};

export const updateOperator = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const operatorDataToUpdate = operatorUpdateSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.consoleUser.update({
    data: {
      firstName: operatorDataToUpdate.firstName,
      lastName: operatorDataToUpdate.lastName,
      country: operatorDataToUpdate.country,
    },
    where: { userId: req.userId },
  });
  const { password, ...infoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    infoWithoutPassword,
    "Profile updated"
  ).send(res);
};

export const deleteOperator = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }

  const userId = uuidSchema.parse(req.params.userId);
  const prisma = await getClientByTenantId(req.tenantId);
  await prisma.consoleUser.delete({
    where: {
      userId: userId,
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Operator deleted successfully"
  ).send(res);
};

export const changeUserStatus = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const userId = uuidSchema.parse(req.params.userId);
  const prisma = await getClientByTenantId(req.tenantId);
  const statusValue = userStatuSchema.parse(req.body);
  const user = await prisma.user.update({
    data: {
      status: statusValue.status,
    },
    where: { userId: userId },
  });
  const { password, ...infoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    infoWithoutPassword,
    "User status updated successfully"
  ).send(res);
};

export const changeOrganisationStatus = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }

  const organisationId = uuidSchema.parse(req.params.organisationId);
  console.log({ organisationId });
  const statusValue = organisationStatuSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const updatedOrganisation = await prisma.organisation.update({
    where: {
      organisationId: organisationId,
    },
    data: {
      status: statusValue.status,
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    updatedOrganisation,
    "Organisation status updated successfully"
  ).send(res);
};

export const getAllOrganisation = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const organisations = await prisma.organisation.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      userOrganisation: {
        include: {
          user: true,
        },
      },
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    organisations,
    "Organisations fetched successfully"
  ).send(res);
};

export const changePassword = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const { oldPassword, password } = consolePasswordSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const findConsoleUser = await prisma.consoleUser.findUniqueOrThrow({
    where: {
      userId: req.userId,
    },
  });
  const verifyPassword = await compareEncryption(
    oldPassword,
    findConsoleUser?.password
  );
  if (!verifyPassword) {
    throw new UnAuthorizedError();
  }
  const hashedPassword = await encrypt(password);
  await prisma.consoleUser.update({
    data: {
      password: hashedPassword,
    },
    where: {
      userId: req.userId,
    },
  });
  const { password: _, ...withoutPassword } = findConsoleUser;
  return new SuccessResponse(
    StatusCodes.OK,
    withoutPassword,
    "Change password successfully"
  ).send(res);
};

export const updateConsoleUserAvtarImg = async (
  req: express.Request,
  res: express.Response
) => {
  const files = avatarImgConsoleSchema.parse(req.files);
  const prisma = await getClientByTenantId(req.tenantId);
  const findUser = await prisma.consoleUser.findFirst({
    where: { userId: req.userId },
  });
  if (!findUser) throw new NotFoundError("User not found");
  const avatarImgURL = await AwsUploadService.uploadFileWithContent(
    `${findUser.userId}-${files?.avatarImg?.name}`,
    files?.avatarImg?.data,
    "user-profiles"
  );
  const user = await prisma.consoleUser.update({
    data: {
      avatarImg: avatarImgURL,
    },
    where: { userId: req.userId },
  });
  return new SuccessResponse(StatusCodes.OK, user, "Profile updated").send(res);
};
