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
  reAssginedTaskSchema,
} from "../schemas/organisationSchema.js";
import { NotificationTypeEnum, TaskStatusEnum, UserProviderTypeEnum, UserRoleEnum, UserStatusEnum } from "@prisma/client";
import { encrypt } from "../utils/encryption.js";
import { uuidSchema } from "../schemas/commonSchema.js";
import { ZodError } from "zod";
import { EmailService } from "../services/email.services.js";
import { settings } from "../config/settings.js";
import { generateRandomPassword } from "../utils/generateRandomPassword.js";
import { selectUserFields } from "../utils/selectedFieldsOfUsers.js";
import { HistoryTypeEnumValue } from "../schemas/enums.js";
import fileUpload from "express-fileupload";
import moment from 'moment';
import { AwsUploadService } from "../services/aws.services.js";

export const getOrganisationById = async (
  req: express.Request,
  res: express.Response
) => {
  const organisationId = organisationIdSchema.parse(req.params.organisationId);
  const prisma = await getClientByTenantId(req.tenantId);
  const organisations = await prisma.organisation.findFirstOrThrow({
    where: {
      organisationId: organisationId,
      deletedAt: null,
    },
    include: {
      userOrganisation: {
        where: {
          deletedAt: null,
          user: {
            status: UserStatusEnum.ACTIVE,
          },
        },
        select: {
          userOrganisationId: true,
          jobTitle: true,
          role: true,
          taskColour: true,
          user: {
            where: {
              status: UserStatusEnum.ACTIVE
            },
            select: selectUserFields,
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
    where: { userId: req.userId, deletedAt: null },
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
      nonWorkingDays: ["SAT", "SUN"], // Non working days will be defualt as per sheet doc : dev_hitesh - 15-03-2024 
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
      deletedAt: null,
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
      LOGIN: ${newUser.email}
      PASSWORD: ${randomPassword}
      `
      await EmailService.sendEmail(newUser.email, subjectMessage, bodyMessage);
    } catch (error) {
      console.error('Failed to sign up email', error)
    }
    return new SuccessResponse(200, newUser).send(res);
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
    return new SuccessResponse(200, user).send(res);
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
    include: { user: true, },
  });
  const findAssignedTask = await prisma.task.findMany({
    where: {
      deletedAt: null,
      status: {
        notIn: [TaskStatusEnum.COMPLETED],
      },
      assignedUsers: {
        some: {
          deletedAt: null,
          assginedToUserId: findUserOrg.userId,
        },
      },
    },
  });
  if (findAssignedTask.length > 0) {
    throw new BadRequestError("Pending tasks is already exists for this user!");
  }
  
  const findProjectAssginToUser = await prisma.projectAssignUsers.findFirst({
    where: {
      assginedToUserId: findUserOrg.userId
    }
  });
  await prisma.$transaction([
    prisma.userOrganisation.update({
      where: { userOrganisationId },
      data: {
        deletedAt: new Date(),
        user: {
          update: {
            provider: {
              updateMany: {
                where: {
                  userId: findUserOrg.userId
                },
                data: {
                  deletedAt: new Date(),
                }
              }
            },
            deletedAt: new Date(),
          },
        },
      },
    }),
    prisma.projectAssignUsers.delete({
      where: {
        projectAssignUsersId: findProjectAssginToUser?.projectAssignUsersId
      }
    }),
    prisma.user.update({
      where: { userId: findUserOrg.userId },
      data: {
        deletedAt: new Date(),
      },
      include: {
        comment: true,
        userOrganisation: true,
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
      },
    }),
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

export const reassignTasks = async (
  req: express.Request,
  res: express.Response
) => {
  const userId = req.userId;
  if (!userId) {
    throw new BadRequestError("userId not found!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const { oldUserId, newUserId } = reAssginedTaskSchema.parse(req.body);
  const tasksToReassign = await prisma.taskAssignUsers.findMany({
    where: {
      assginedToUserId: oldUserId,
      deletedAt: null,
    },
    include: {
      task: true,
    },
  });

  if (!tasksToReassign || tasksToReassign.length === 0) {
    return new SuccessResponse(
      StatusCodes.OK,
      null,
      "No tasks found to reassign."
    ).send(res);
  }

  await prisma.$transaction(async (tx) => {
    await Promise.all(
      tasksToReassign.map(async (assginedUser) => {
        const oldUser = await tx.taskAssignUsers.delete({
          where: {
            taskAssignUsersId: assginedUser.taskAssignUsersId,
          },
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        });
        const member = await tx.taskAssignUsers.create({
          data: {
            assginedToUserId: newUserId,
            taskId: assginedUser.taskId,
          },
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        });

        //Send notification
        const message = `Task reassigned to you`;
        await prisma.notification.sendNotification(
          NotificationTypeEnum.TASK,
          message,
          newUserId,
          userId,
          assginedUser.taskId
        );

        // History-Manage
        const historyMessage = "Task's assignee was added";
        const historyData = {
          oldValue: oldUser?.user?.email,
          newValue: member.user?.email,
        };

        await prisma.history.createHistory(
          userId,
          HistoryTypeEnumValue.TASK,
          historyMessage,
          historyData,
          member.taskId
        );
      })
    );
  });
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Tasks reassigned successfully."
  ).send(res);
};

export const uploadHolidayCSV = async (
  req: express.Request,
  res: express.Response
) => {
  const userId = req.userId;
  const organisationId = uuidSchema.parse(req.params.organisationId);
  if (!userId) {
    throw new BadRequestError("userId not found!");
  }
  const file = req.files?.csv as fileUpload.UploadedFile;
  if (!file) {
    throw new BadRequestError("No CSV file uploaded!");
  }
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop();
  if (fileExtension !== 'csv') {
    throw new BadRequestError("Please upload a CSV file.");
  }
  const csvString = file.data.toString("utf-8");
  const csvRows = csvString
    .split("\n")
    .map((row, index) => {
      if (index === 0) return null;
      const columns = row.split(";").map((col) => col.trim());
      if (columns.length < 4) return null;
      return {
        Date: moment.utc(columns[0], "DD.MM.YYYY").toDate(),
        Designation: columns[1] ? columns[1].replace(/[\ufffd"]/g, "") : "",
        DayOfWeek: columns[2] ? columns[2].replace(/[\ufffd"]/g, "") : "",
        CalendarWeek: columns[3] ? columns[3].replace(/[\ufffd"]/g, "") : "",
      };
    })
    .filter((row) => row !== null);
  const prisma = await getClientByTenantId(req.tenantId);
  const findUploadedCSV = await prisma.organisation.findFirstOrThrow({
    where: {
      organisationId,
    },
    select: {
      organisationName: true,
      holidayCsvUrl: true,
    },
  });
  const avatarImgURL = await AwsUploadService.uploadFileWithContent(
    `${findUploadedCSV.organisationName}-${fileName}`,
    file.data,
    'organisation-csv'
  );
  await prisma.$transaction(async (prisma) => {
    await Promise.all([
      prisma.organisationHolidays.deleteMany({
        where: { organisationId },
      }),
      prisma.organisation.update({
        where: { organisationId },
        data: {
          holidayCsvUrl: avatarImgURL
        }
      })
    ]);

    const holidayRecords = csvRows.map(async (value) => {
      if (value?.Date) {
        const findHoliday = await prisma.organisationHolidays.findFirst({
          where: {
            organisationId,
            holidayStartDate: value.Date,
            holidayReason: value.Designation,
          },
        });
        if (!findHoliday) {
          return prisma.organisationHolidays.create({
            data: {
              holidayStartDate: value.Date,
              holidayEndDate: null,
              holidayReason: value.Designation,
              organisationId: organisationId,
            },
          });
        }
      }
    });

    await Promise.all(holidayRecords);
  });
  return new SuccessResponse(
    StatusCodes.OK,
    csvRows,
    "Successfully uploaded holidays"
  ).send(res);
};

export const resendInvitationToMember = async (
  req: express.Request,
  res: express.Response
) => {
  const userOrganisationId = uuidSchema.parse(req.params.userOrganisationId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findMember = await prisma.userOrganisation.findFirstOrThrow({
    where: {
      userOrganisationId,
    },
    include: {
      organisation: true,
      user: {
        select: {
          userId: true,
          email: true,
          isVerified: true,
        },
      },
    },
  });
  if (findMember.user?.isVerified) {
    throw new BadRequestError("Organisation member is already verified!");
  }
  if (!findMember.user) {
    throw new BadRequestError("Member not found!");
  }
  const randomPassword = generateRandomPassword();
  const hashedPassword = await encrypt(randomPassword);
  try {
    const subjectMessage = `Invited`;
    const bodyMessage = `
    You are invited in Organisation ${findMember.organisation?.organisationName}
    
    URL: ${settings.appURL}/login
    LOGIN: ${findMember.user.email}
    PASSWORD: ${randomPassword}
    `;
    
    const findProvider = await prisma.userProvider.findFirstOrThrow({
      where: {
        userId: findMember.user.userId,
        providerType: UserProviderTypeEnum.EMAIL,
      },
    });
    await prisma.userProvider.update({
      where: {
        userProviderId: findProvider.userProviderId,
      },
      data: {
        idOrPassword: hashedPassword,
        providerType: UserProviderTypeEnum.EMAIL,
      },
    });
    await EmailService.sendEmail(
      findMember.user.email,
      subjectMessage,
      bodyMessage
    );
  } catch (error) {
    console.error("Failed resend email", error);
  }
  return new SuccessResponse(StatusCodes.OK, null, "Resend Invitation").send(
    res
  );
};
