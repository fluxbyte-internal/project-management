import express from "express";
import { getClientByTenantId } from "../config/db.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  SuccessResponse,
} from "../config/apiError.js";
import { StatusCodes } from "http-status-codes";
import {
  createOrganisationSchema,
  organisationIdSchema,
  updateOrganisationSchema,
  addOrganisationMemberSchema,
  memberRoleSchema,
} from "../schemas/organisationSchema.js";
import { TaskStatusEnum, UserProviderTypeEnum, UserRoleEnum, UserStatusEnum } from "@prisma/client";
import { encrypt } from "../utils/encryption.js";
import { uuidSchema } from "../schemas/commonSchema.js";
import { ZodError } from "zod";
import { EmailService } from "../services/email.services.js";
import { settings } from "../config/settings.js";
import { generateRandomPassword } from "../utils/generateRandomPassword.js";

export const getOrganisationById = async (
  req: express.Request,
  res: express.Response
) => {
  const organisationId = organisationIdSchema.parse(req.params.organisationId);
  const prisma = await getClientByTenantId(req.tenantId);
  const organisations = await prisma.organisation.findFirstOrThrow({
    where: {
      organisationId: organisationId,
    },
    include: {
      userOrganisation: {
        select: {
          userOrganisationId: true,
          jobTitle: true,
          role: true,
          taskColour: true,
          user: {
            select: {
              userId: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarImg: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        }
      },
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    organisations,
    "Organisation selected"
  ).send(res);
};

export const createOrganisation = async (
  req: express.Request,
  res: express.Response
) => {
  const { organisationName, industry, status, country, nonWorkingDays } =
    createOrganisationSchema.parse(req.body);
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const prisma = await getClientByTenantId(req.tenantId);

  // CASE : One user can create only one organisation
  const findOrganisation = await prisma.userOrganisation.findFirst({
    where: { userId: req.userId },
  });
  if (findOrganisation) {
    throw new BadRequestError("Organisation is already created");
  }

  const organisation = await prisma.organisation.create({
    data: {
      organisationName: organisationName,
      industry: industry,
      status: status,
      country: country,
      tenantId: req.tenantId,
      createdByUserId: req.userId,
      updatedByUserId: req.userId,
      userOrganisation: {
        create: {
          userId: req.userId,
          role: UserRoleEnum.ADMINISTRATOR,
        },
      },
      nonWorkingDays: nonWorkingDays,
    },
  });
  const findUser = await prisma.user.findFirst({
    where: { userId: req.userId },
  });
  if (findUser?.country === null) {
    await prisma.user.update({
      where: { userId: req.userId },
      data: {
        country: country,
      },
    });
  };
  return new SuccessResponse(
    StatusCodes.CREATED,
    organisation,
    "Organisation created successfully"
  ).send(res);
};

export const updateOrganisation = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!");
  }
  const organisationId = organisationIdSchema.parse(req.params.organisationId);
  const updateOrganisationValue = updateOrganisationSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);

  const organisation = await prisma.organisation.findFirst({
    where: {
      organisationId: organisationId,
    },
    include: {
      userOrganisation: true,
    },
  });

  if (!organisation) throw new NotFoundError("Organisation not found");

  if (
    !organisation.userOrganisation.some(
      (uo) => uo.userId === req.userId && UserRoleEnum.ADMINISTRATOR == uo.role
    )
  ) {
    throw new ForbiddenError();
  }

  let updateObj = { ...updateOrganisationValue, updatedByUserId: req.userId };
  const organisationUpdate = await prisma.organisation.update({
    where: {
      organisationId: organisationId,
      userOrganisation: {
        some: {
          role: UserRoleEnum.ADMINISTRATOR,
        },
      },
    },
    data: { ...updateObj },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    organisationUpdate,
    "Organisation updated successfully"
  ).send(res);
};

export const addOrganisationMember = async (
  req: express.Request,
  res: express.Response
) => {
  const member = addOrganisationMemberSchema.parse(req.body);
  const organisationId = uuidSchema.parse(req.params.organisationId);
  const prisma = await getClientByTenantId(req.tenantId);
  const user = await prisma.user.findFirst({
    where: {
      email: member.email,
    },
    include: {
      userOrganisation: {
        include: {
          organisation: true,
        },
      },
    },
  });
  if (!user) {
    const randomPassword = generateRandomPassword();
    const hashedPassword = await encrypt(randomPassword);
    const newUser = await prisma.user.create({
      data: {
        email: member.email,
        status: UserStatusEnum.ACTIVE,
        provider: {
          create: {
            idOrPassword: hashedPassword, 
            providerType: UserProviderTypeEnum.EMAIL
          }
        },
        userOrganisation: {
          create: {
            role: member.role,
            organisationId: organisationId
          }
        }
      },
      include: {
        userOrganisation: {
          include: {
            organisation: true
          }
        }
      }
    });
    try {
      const newUserOrg = newUser.userOrganisation.find(org => org.organisationId === organisationId);
      const subjectMessage = `Invited`;
      const bodyMessage = `
      You are invited in Organisation ${newUserOrg?.organisation?.organisationName}
      
      URL: ${settings.appURL}/login
      EMAIL: ${newUser.email}
      PASSWORD: ${randomPassword}
      `
      await EmailService.sendEmail(newUser.email, subjectMessage, bodyMessage);
    } catch (error) {
      console.error('Failed to sign up email', error)
    }
    return new SuccessResponse(200, null).send(res);
  } else {
    if (
      user.userOrganisation.find((uo) => uo.organisationId === organisationId)
    ) {
      throw new ZodError([{
        code: 'invalid_string',
        message: 'User already added in your organisation',
        path: ['email'],
        validation: "email",
      }]);
    }
    if (user.userOrganisation.length !== 0) {
      throw new ZodError([{
        code: 'invalid_string',
        message: 'User is part of other organisation',
        path: ['email'],
        validation: "email",
      }]);
    }
    await prisma.userOrganisation.create({
      data: {
        role: member.role,
        userId: user.userId,
        organisationId,
      },
    });
    return new SuccessResponse(200, null).send(res);
  }
};

export const removeOrganisationMember = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const userOrganisationId = uuidSchema.parse(req.params.userOrganisationId);
  const findUserOrg = await prisma.userOrganisation.findFirstOrThrow({
    where: { userOrganisationId },
  });
  const findAssignedTask = await prisma.task.findMany({
    where: {
      status: {
        notIn: [TaskStatusEnum.DONE],
      },
      assignedUsers: {
        some: {
          assginedToUserId: findUserOrg.userId,
        },
      },
    },
  });
  if (findAssignedTask.length > 0) {
    throw new BadRequestError("Pending tasks is already exists for this user!");
  }
  await prisma.$transaction([
    prisma.userOrganisation.delete({
      where: { userOrganisationId },
    }),
    prisma.user.delete({
      where: { userId: findUserOrg.userId },
      include: {
        comment: true,
        userOrganisation: true,
        userOtp: true,
        userResetPassword: true,
        createdOrganisations: true,
        updatedOrganisations: true,
        createdProject: true,
        updatedProject: true,
        provider: true,
        createdTask: true,
        updatedTask: true,
        taskAssignUsers: true,
        createdKanbanColumn: true,
        updatedKanbanColumn: true,
        history: true,
        uploadedAttachment: true,
        addedDependencies: true,
        sentNotifications: true,
        receivedNotifications: true,
      }
    })
  ]);
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Member removed successfully"
  ).send(res);
};

export const changeMemberRole = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!");
  }
  const userOrganisationId = uuidSchema.parse(req.params.userOrganisationId);
  const { role } = memberRoleSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  await prisma.userOrganisation.update({
    where: { userOrganisationId: userOrganisationId },
    data: {
      role: role,
    },
  }); 
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Member role changed successfully"
  ).send(res);
};
