import express from "express";
import { getClientByTenantId } from "../config/db.js";
import { BadRequestError, InternalServerError, NotFoundError, SuccessResponse } from "../config/apiError.js";
import { StatusCodes } from "http-status-codes";
import {
  userUpdateSchema,
  userOrgSettingsUpdateSchema,
  avatarImgSchema,
} from "../schemas/userSchema.js";
import { uuidSchema } from "../schemas/commonSchema.js";
import { verifyEmailOtpSchema } from "../schemas/authSchema.js";
import { EmailService } from "../services/email.services.js";
import { OtpService } from "../services/userOtp.services.js";
import { generateOTP } from "../utils/otpHelper.js";
import { AwsUploadService } from "../services/aws.services.js";

export const me = async (req: express.Request, res: express.Response) => {
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.findUniqueOrThrow({
    where: { userId: req.userId },
    include: {
      userOrganisation: { include: { organisation: true } },
    },
  });
  const { password, ...userInfoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    userInfoWithoutPassword,
    "Login user details"
  ).send(res);
};

export const updateUserProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const userDataToUpdate = userUpdateSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);

  const user = await prisma.user.update({
    data: {
      ...userDataToUpdate,
    },
    where: { userId: req.userId },
  });
  const { password, ...userInfoWithoutPassword } = user;
  return new SuccessResponse(
    StatusCodes.OK,
    userInfoWithoutPassword,
    "User profile updated"
  ).send(res);
};

export const updateUserAvtarImg = async (
  req: express.Request,
  res: express.Response
) => {
  const files = avatarImgSchema.parse(req.files);
  const prisma = await getClientByTenantId(req.tenantId);
  const findUser = await prisma.user.findFirst({
    where: { userId: req.userId },
  });
  if (!findUser) throw new NotFoundError("User not found");
  const avatarImgURL = await AwsUploadService.uploadFileWithContent(
    `${findUser.userId}-${files?.avatarImg?.name}`,
    files?.avatarImg?.data
  );
  const user = await prisma.user.update({
    data: {
      avatarImg: avatarImgURL,
    },
    where: { userId: req.userId },
  });
  return new SuccessResponse(StatusCodes.OK, user, "User profile updated").send(
    res
  );
};

export const updateUserOrganisationSettings = async (
  req: express.Request,
  res: express.Response
) => {
  const userOrgSettingsData = userOrgSettingsUpdateSchema.parse(req.body);
  const userOrganisationId = uuidSchema.parse(req.params.userOrganisationId);
  const prisma = await getClientByTenantId(req.tenantId);
  await prisma.userOrganisation.update({
    data: {
      ...userOrgSettingsData,
    },
    where: { userOrganisationId, userId: req.userId },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "User organisation settings updated"
  ).send(res);
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