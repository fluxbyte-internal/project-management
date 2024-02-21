import { Request, Response } from "express";
import { BadRequestError, SuccessResponse } from "../config/apiError.js";
import { StatusCodes } from "http-status-codes";
import { getClientByTenantId } from "../config/db.js";
import {
  ProjectOverAllTrackEnum,
  ProjectStatusEnum,
  TaskStatusEnum,
  UserRoleEnum,
} from "@prisma/client";
import { StatusCounts } from "../types/statusCount.js";
import { uuidSchema } from "../schemas/commonSchema.js";
import { calculationSPI } from "../utils/calculateSPI.js";
import { calculationCPI } from "../utils/calculateCPI.js";
import { calculationTPI } from "../utils/calculationFlag.js";

export const projectManagerProjects = async (req: Request, res: Response) => {
  if(!req.organisationId) {
    throw new BadRequestError("OrganisationId not found!")
  }
  const userId = req.userId;
  const organisationId = req.organisationId;
  const prisma = await getClientByTenantId(req.tenantId);

  const projectManagersProjects = await prisma.project.findMany({
    where: {
      deletedAt: null,
      OR: [
        {
          deletedAt: null,
          organisationId: req.organisationId,
          assignedUsers: {
            some: {
              assginedToUserId: userId,
            },
          },
        },
        {
          createdByUserId: userId,
        },
      ],
    },
    include: {
      tasks: true
    }
  });

  // Calculate Number of Portfolio Projects per Status
  const allStatusValues: ProjectStatusEnum[] = [
    ProjectStatusEnum.NOT_STARTED,
    ProjectStatusEnum.ACTIVE,
    ProjectStatusEnum.ON_HOLD,
    ProjectStatusEnum.CLOSED,
  ];

  const statusCounts: StatusCounts = allStatusValues.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as StatusCounts);

  projectManagersProjects.forEach((project) => {
    const status = project.status as ProjectStatusEnum;
    statusCounts[status]++;
  });

  // Calculate Number of Portfolio Projects per Overall Situation
  const overallSituationCounts: StatusCounts = projectManagersProjects.reduce(
    (acc, project) => {
      const overallSituation = project.overallTrack as ProjectOverAllTrackEnum;
      acc[overallSituation] = (acc[overallSituation] || 0) + 1;
      return acc;
    },
    {} as StatusCounts
  );

  // Data for the status chart
  const statusChartData = {
    labels: Object.keys(statusCounts),
    data: Object.values(statusCounts),
  };
  // Data for the overall situation chart
  const overallSituationChartData = {
    labels: Object.keys(overallSituationCounts),
    data: Object.values(overallSituationCounts),
  };

  const projects = await Promise.all(projectManagersProjects.map(async (project) => {
    const CPI = await calculationCPI(project, req.tenantId, organisationId);
    const completedTasksCount = await prisma.task.count({
      where: {
        projectId: project.projectId,
        status: TaskStatusEnum.COMPLETED
      }
    });
    return { ...project, CPI, completedTasksCount };
  }));

  const response = {
    projects,
    statusChartData,
    overallSituationChartData,
  };
  return new SuccessResponse(
    StatusCodes.OK,
    response,
    "Portfolio projects of PM"
  ).send(res);
};

export const administartorProjects = async (req: Request, res: Response) => {
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!");
  }
  const organisationId = req.organisationId;
  const prisma = await getClientByTenantId(req.tenantId);
  const orgCreatedByUser = await prisma.organisation.findFirstOrThrow({
    where: {
      createdByUserId: req.userId,
      organisationId: organisationId,
      deletedAt: null,
    },
    include: {
      projects: true,
    },
  });

  // Calculate Number of Portfolio Projects per Status
  const allStatusValues: ProjectStatusEnum[] = [
    ProjectStatusEnum.NOT_STARTED,
    ProjectStatusEnum.ACTIVE,
    ProjectStatusEnum.ON_HOLD,
    ProjectStatusEnum.CLOSED,
  ];

  const statusCounts: StatusCounts = allStatusValues.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as StatusCounts);

  orgCreatedByUser.projects.forEach((project) => {
    const status = project.status as ProjectStatusEnum;
    statusCounts[status]++;
  });

  // Calculate Number of Portfolio Projects per Overall Situation
  const overallSituationCounts: StatusCounts = orgCreatedByUser.projects.reduce(
    (acc, project) => {
      const overallSituation = project.overallTrack as ProjectOverAllTrackEnum;
      acc[overallSituation] = (acc[overallSituation] || 0) + 1;
      return acc;
    },
    {} as StatusCounts
  );

  // Data for the status chart
  const statusChartData = {
    labels: Object.keys(statusCounts),
    data: Object.values(statusCounts),
  };

  // Data for the overall situation chart
  const overallSituationChartData = {
    labels: Object.keys(overallSituationCounts),
    data: Object.values(overallSituationCounts),
  };

  const projectsWithCPI = await Promise.all(
    orgCreatedByUser.projects.map(async (project) => {
      const CPI = await calculationCPI(project, req.tenantId, organisationId);
      const completedTasksCount = await prisma.task.count({
        where: {
          projectId: project.projectId,
          status: TaskStatusEnum.COMPLETED,
          deletedAt: null,
        }
      });
      const projectManagerInfo = await prisma.projectAssignUsers.findMany({
        where: {
          projectId: project.projectId,
          user: {
            deletedAt: null,
            userOrganisation: {
              some: {
                role: {
                  equals: UserRoleEnum.PROJECT_MANAGER,
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
            equals: UserRoleEnum.ADMINISTRATOR,
          },
          organisationId: req.organisationId,
          deletedAt: null,
        },
        include: {
          user: true,
        },
      });
      return {
        ...project,
        CPI,
        completedTasksCount,
        projectManager: projectManagerInfo.length === 0 ?  projectAdministartor : projectManagerInfo
      };
    })
  );
  orgCreatedByUser.projects = projectsWithCPI;

  const response = {
    orgCreatedByUser,
    statusChartData,
    overallSituationChartData,
  };
  return new SuccessResponse(
    StatusCodes.OK,
    response,
    "Portfolio projects of Administartor"
  ).send(res);
};

export const projectDashboardByprojectId = async (
  req: Request,
  res: Response
) => {
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!!");
  }
  const organisationId = req.organisationId;
  const projectId = uuidSchema.parse(req.params.projectId);

  // Fetch projects created by the user
  const prisma = await getClientByTenantId(req.tenantId);
  const projectWithTasks = await prisma.project.findFirstOrThrow({
    where: {
      projectId,
      deletedAt: null,
    },
    include: {
      tasks: {
        where: {
          deletedAt: null,
        },
        include: {
          assignedUsers: true,
        },
      },
    },
  });

  // Count the number of task for the project
  const numTasks = projectWithTasks.tasks.length;

  // Calculate the number of milestones for the project
  const numMilestones = projectWithTasks.tasks.reduce(
    (acc, task) => acc + (task.milestoneIndicator ? 1 : 0),
    0
  );

  const budgetTrack = projectWithTasks.budgetTrack;
  const projectOverAllSituation = projectWithTasks.overallTrack;
  const consumedBudget = projectWithTasks.consumedBudget;
  const estimatedBudget = projectWithTasks.estimatedBudget;
  const actualCost = projectWithTasks.actualCost;
  const scheduleTrend = projectWithTasks.scheduleTrend;
  const budgetTrend = projectWithTasks.budgetTrend;
  const projectProgression = await prisma.project.projectProgression(projectId, req.tenantId, req.organisationId);

  // CPI
  const cpi = await calculationCPI(projectWithTasks, req.tenantId, organisationId);

  // SPI
  const tasksWithSPI = projectWithTasks.tasks.map(async task => {
    const spi = await calculationSPI(task, req.tenantId, organisationId);
    return { 
      taskId: task.taskId,
      taskName: task.taskName,
      spi,
      taskStatus: task.status
     };
  });
  const spi = await Promise.all(tasksWithSPI);

  // Project Date's
  const duration = Math.ceil((new Date(projectWithTasks.actualEndDate).getTime() - new Date(projectWithTasks.startDate).getTime()) / 86400000) + 1;
  const projectDates = {
    startDate: projectWithTasks.startDate,
    estimatedEndDate: projectWithTasks.estimatedEndDate,
    actualEndDate: projectWithTasks.actualEndDate,
    projectCreatedAt: projectWithTasks.createdAt,
    duration,
  };

  // Calculate Number of Portfolio Projects per Overall Situation
  const statusCounts: StatusCounts = projectWithTasks.tasks.reduce(
    (acc, task) => {
      const status = task.status as TaskStatusEnum;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as StatusCounts
  );

  // Data for the task status chart
  const taskStatusChartData = {
    labels: Object.keys(statusCounts),
    data: Object.values(statusCounts),
  };

  // Calculate TPI and Deley for each task in the project
  const taskDelayChartDataPromises = projectWithTasks.tasks.map(async (task) => {
    const flag = await calculationTPI(task, req.tenantId, organisationId);
    return {
      taskId: task.taskId,
      taskName: task.taskName,
      tpiValue: flag.tpiValue,
      tpiFlag: flag.tpiFlag,
    };
  });
  const taskDelayChartData = await Promise.all(taskDelayChartDataPromises);

  // Count of working users in this project
  const numTeamMembersWorkingOnTasks = await prisma.projectAssignUsers.count({
    where: {
      projectId,
      user: {
        userOrganisation: {
          some: {
            role: {
              in: [UserRoleEnum.PROJECT_MANAGER, UserRoleEnum.TEAM_MEMBER],
            },
          },
        },
      },
    },
  });

  const response = {
    numTasks,
    numMilestones,
    projectDates,
    budgetTrack,
    taskStatusChartData,
    taskDelayChartData,
    numTeamMembersWorkingOnTasks,
    projectOverAllSituation,
    projectStatus: projectWithTasks.status,
    spi,
    cpi,
    budgetTrend,
    scheduleTrend,
    actualCost,
    consumedBudget,
    estimatedBudget,
    projectProgression,
  };
  return new SuccessResponse(
    StatusCodes.OK,
    response,
    "Portfolio for selected project"
  ).send(res);
};
