import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { consumedBudgetSchema, createKanbanSchema, createProjectSchema, projectIdSchema, projectStatusSchema, updateKanbanSchema, updateProjectSchema } from '../schemas/projectSchema.js';
import { NotificationTypeEnum, ProjectStatusEnum, TaskStatusEnum, UserRoleEnum } from '@prisma/client';
import { uuidSchema } from '../schemas/commonSchema.js';
import { assginedToUserIdSchema } from '../schemas/taskSchema.js';
import { selectUserFields } from '../utils/selectedFieldsOfUsers.js';

export const getProjects = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const prisma = await getClientByTenantId(req.tenantId);

  let projects;
  const userRole = await prisma.userOrganisation.findFirst({
    where: {
      organisationId: req.organisationId,
      userId: req.userId,
    },
    select: {
      role: true,
    },
  });
  if (!userRole) {
    throw new BadRequestError("User role not found!!");
  }

  if (userRole.role === UserRoleEnum.ADMINISTRATOR) {
    projects = await prisma.project.findMany({
      where: {
        organisationId: req.organisationId,
      },
      include: {
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatarImg: true,
          },
        },
        organisation: {
          include: {
            userOrganisation: {
              include: {
                user: true,
              },
            },
          },
        },
        assignedUsers: {
          include: {
            user: {
              include: {
                userOrganisation: {
                  select: {
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (userRole!.role === UserRoleEnum.PROJECT_MANAGER) {
    projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            organisationId: req.organisationId,
            assignedUsers: {
              some: {
                assginedToUserId: req.userId,
              },
            },
          },
          {
            createdByUserId: req.userId,
          },
        ],
      },
      include: {
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatarImg: true,
          },
        },
        organisation: {
          include: {
            userOrganisation: {
              include: {
                user: true,
              },
            },
          },
        },
        assignedUsers: {
          include: {
            user: {
              include: {
                userOrganisation: {
                  select: {
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    projects = await prisma.project.findMany({
      where: {
        organisationId: req.organisationId,
        assignedUsers: {
          some: {
            assginedToUserId: req.userId,
          },
        },
      },
      include: {
        createdByUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatarImg: true,
          },
        },
        organisation: {
          include: {
            userOrganisation: {
              include: {
                user: true,
              },
            },
          },
        },
        assignedUsers: {
          include: {
            user: {
              include: {
                userOrganisation: {
                  select: {
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // progressionPercentage for all projects
  const projectsWithProgression = [];

  for (const project of projects) {
    const progressionPercentage = await prisma.project.projectProgression(
      project.projectId
    );
    const projectManager = await prisma.projectAssignUsers.findMany({
      where: {
        projectId: project.projectId,
        user: {
          userOrganisation: {
            some: {
              role: {
                in: [UserRoleEnum.PROJECT_MANAGER],
              },
            },
          },
        },
      },
      select: {
        user: true,
      },
    });
    const projectAdministartor = await prisma.userOrganisation.findMany({
      where: {
        role: {
          in: [UserRoleEnum.ADMINISTRATOR],
        },
        organisationId: req.organisationId,
      },
      include: {
        user: true,
      },
    });
    const projectManagerInfo =
      projectManager.length !== 0 ? projectManager : projectAdministartor;
    const projectWithProgression = {
      ...project,
      progressionPercentage,
      projectManagerInfo,
    };
    projectsWithProgression.push(projectWithProgression);
  }
  return new SuccessResponse(StatusCodes.OK, projectsWithProgression, 'get all project successfully').send(res);
};

export const getProjectById = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const projects = await prisma.project.findFirstOrThrow({
    where: { organisationId: req.organisationId, projectId: projectId, deletedAt: null, },
    include: {
      tasks: {
        where: { deletedAt: null },
      },
      createdByUser: {
        select: selectUserFields
      },
      assignedUsers: {
        include: {
          user: {
            include: {
              userOrganisation: {
                select: {
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const progressionPercentage = await prisma.project.projectProgression(projectId);
  const response = { ...projects, progressionPercentage };
  return new SuccessResponse(StatusCodes.OK, response, "project selected").send(
    res
  );
};

export const createProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  if (!req.userId) { throw new BadRequestError('userId not found!') };
  const {
    projectName,
    projectDescription,
    startDate,
    estimatedEndDate,
    estimatedBudget,
    defaultView,
    currency
  } = createProjectSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const project = await prisma.project.create({
    data: {
      organisationId: req.organisationId,
      projectName: projectName,
      projectDescription: projectDescription,
      startDate: startDate,
      estimatedEndDate: estimatedEndDate,
      actualEndDate: estimatedEndDate,
      status: ProjectStatusEnum.NOT_STARTED,
      estimatedBudget: estimatedBudget,
      defaultView: defaultView,
      createdByUserId: req.userId,
      updatedByUserId: req.userId,
      currency: currency
    }
  });
  return new SuccessResponse(StatusCodes.CREATED, project, 'project created successfully').send(res);
};

export const deleteProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId, deletedAt: null, } });
  if (findProject) {
    await prisma.project.update({
      where: { projectId },
      data: {
        deletedAt: new Date(),
      },
    });
    return new SuccessResponse(
      StatusCodes.OK,
      null,
      "project deleted successfully"
    ).send(res);
  }
};

export const updateProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  if (!req.userId) { throw new BadRequestError('userId not found!') };
  const projectUpdateValue = updateProjectSchema.parse(req.body)
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({
    where: {
      projectId: projectId,
      organisationId: req.organisationId,
      deletedAt: null,
    }
  });
  if (!findProject) throw new NotFoundError('Project not found');
  let updateObj = { ...projectUpdateValue, updatedByUserId: req.userId };
  const projectUpdate = await prisma.project.update({
    where: { projectId: projectId },
    data: { ...updateObj },
  });
  return new SuccessResponse(StatusCodes.OK, projectUpdate, 'project updated successfully').send(res);
};

export const getKanbanColumnById = async (
  req: express.Request,
  res: express.Response
) => {
  const projectId = uuidSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const kanbanColumn = await prisma.kanbanColumn.findMany({
    where: { projectId, deletedAt: null },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    kanbanColumn,
    "kanban column selected"
  ).send(res);
};

export const statusChangeProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  if (!req.userId) { throw new BadRequestError('userId not found!') };
  const { status } = projectStatusSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId, deletedAt: null, } });
  if (findProject) {
    const findTaskWithIncompleteTask = await prisma.task.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        status: {
          in: [
            TaskStatusEnum.TODO,
            TaskStatusEnum.PLANNED,
            TaskStatusEnum.IN_PROGRESS,
          ],
        },
      },
    });
    if (
      findTaskWithIncompleteTask.length > 0 &&
      status === ProjectStatusEnum.CLOSED
    ) {
      throw new BadRequestError("Incomplete tasks exists!");
    }
  }
  const updateProject = await prisma.project.update({
    where: { projectId: projectId },
    data: { status: status, updatedByUserId: req.userId },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    updateProject,
    "project status change successfully"
  ).send(res);
};

export const createKanbanColumn = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!");
  }
  const projectId = uuidSchema.parse(req.params.projectId);
  const { name, percentage } = createKanbanSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const kanbanColumn = await prisma.kanbanColumn.create({
    data: {
      projectId,
      name,
      percentage,
      createdByUserId: req.userId,
    },
  });
  return new SuccessResponse(
    StatusCodes.CREATED,
    kanbanColumn,
    "kanban column created successfully"
  ).send(res);
};

export const updatekanbanColumn = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!");
  }
  const kanbanColumnId = uuidSchema.parse(req.params.kanbanColumnId);
  const kanbanColumnUpdateValue = updateKanbanSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const findKanbanColumn = await prisma.kanbanColumn.findFirstOrThrow({
    where: {
      kanbanColumnId,
      deletedAt: null
    },
  });
  let updateObj = { ...kanbanColumnUpdateValue, updatedByUserId: req.userId };
  const kanbanColumnUpdate = await prisma.kanbanColumn.update({
    where: { kanbanColumnId },
    data: { ...updateObj },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    kanbanColumnUpdate,
    "kanban column updated successfully"
  ).send(res);
};

export const deleteKanbanColumn = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!");
  }
  const kanbanColumnId = uuidSchema.parse(req.params.kanbanColumnId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findKanbanColumn = await prisma.kanbanColumn.findFirstOrThrow({
    where: { kanbanColumnId, deletedAt: null },
  });
  if (findKanbanColumn) {
    await prisma.kanbanColumn.update({
      where: { kanbanColumnId },
      data: {
        deletedAt: new Date(),
      },
    });
    return new SuccessResponse(
      StatusCodes.OK,
      null,
      "kanban column deleted successfully"
    ).send(res);
  }
};

export const addConsumedBudgetToProject = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!");
  }
  const projectId = uuidSchema.parse(req.params.projectId);
  const { consumedBudget } = consumedBudgetSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const projectUpdate = await prisma.project.update({
    where: { projectId: projectId },
    data: { 
      consumedBudget
     },
  });
  return new SuccessResponse(StatusCodes.OK, projectUpdate, 'consumed budget updated successfully').send(res);
};


export const assignedUserToProject = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }

  const projectId = uuidSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);

  const { assginedToUserId } = assginedToUserIdSchema.parse(req.body);
  const findUser = await prisma.user.findUnique({
    where: {
      userId: assginedToUserId,
    },
    select: {
      userOrganisation: {
        select: {
          role: true,
        },
      },
    },
  });
  const findProjectManager = await prisma.projectAssignUsers.findMany({
    where: {
      projectId,
      user: {
        userOrganisation: {
          some: {
            role: {
              in: [UserRoleEnum.PROJECT_MANAGER],
            },
          },
        },
      },
    },
  });
  if (
    findProjectManager &&
    findProjectManager.length !== 0 &&
    findUser?.userOrganisation[0]?.role === UserRoleEnum.PROJECT_MANAGER
  ) {
    throw new BadRequestError("Project Manager already exists!!");
  }

  const member = await prisma.projectAssignUsers.create({
    data: {
      assginedToUserId,
      projectId,
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
  const message = `Project assigned to you`;
  await prisma.notification.sendNotification(
    NotificationTypeEnum.PROJECT,
    message,
    assginedToUserId,
    req.userId,
    projectId
  );

  return new SuccessResponse(
    StatusCodes.CREATED,
    member,
    "User assgined successfully"
  ).send(res);
};

export const deleteAssignedUserFromProject = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const projectAssignUsersId = uuidSchema.parse(
    req.params.projectAssignUsersId
  );
  const prisma = await getClientByTenantId(req.tenantId);
  await prisma.projectAssignUsers.delete({
    where: {
      projectAssignUsersId,
    },
  });

  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "User removed successfully"
  ).send(res);
};

export const projectAssignToUser = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const usersOfOrganisation = await prisma.userOrganisation.findMany({
    where: {
      organisationId: req.organisationId,
      role: {
        notIn: [UserRoleEnum.ADMINISTRATOR],
      },
    },
    select: {
      role: true,
      organisationId: true,
      userOrganisationId: true,
      user: {
        select: {
          userId: true,
          avatarImg: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return new SuccessResponse(
    StatusCodes.OK,
    usersOfOrganisation,
    "Get organisation's users successfully"
  ).send(res);
};
