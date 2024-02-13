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

export const projectManagerProjects = async (req: Request, res: Response) => {
  const userId = req.userId;
  const prisma = await getClientByTenantId(req.tenantId);

  const projectManagersProjects = await prisma.project.findMany({
    where: {
      OR: [
        {
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
    const CPI = await prisma.project.calculationCPI(project);
    const completedTasksCount = await prisma.task.count({
      where: {
        projectId: project.projectId,
        status: TaskStatusEnum.DONE
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
  const prisma = await getClientByTenantId(req.tenantId);
  const orgCreatedByUser = await prisma.organisation.findFirstOrThrow({
    where: {
      createdByUserId: req.userId,
      organisationId: req.organisationId,
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

  // Fetch project manager information for each project
  const projectsWithProjectManager = await Promise.all(
    orgCreatedByUser.projects.map(async (project) => {
      const CPI = prisma.project.calculationCPI(project);
      const completedTasksCount = await prisma.task.count({
        where: {
          projectId: project.projectId,
          status: TaskStatusEnum.DONE
        }
      });
      const projectManagerInfo = await prisma.projectAssignUsers.findMany({
        where: {
          projectId: project.projectId,
          user: {
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
      // If project manager not found, get administrators of the organization
      if (projectManagerInfo.length === 0) {
        const projectAdministartor = await prisma.userOrganisation.findMany({
          where: {
            role: {
              equals: UserRoleEnum.ADMINISTRATOR,
            },
            organisationId: req.organisationId,
          },
          include: {
            user: true,
          },
        });
        return {
          ...project,
          projectManagerInfo: projectAdministartor,
          CPI,
          completedTasksCount
        };
      } else {
        return {
          ...project,
          projectManagerInfo,
          CPI,
          completedTasksCount
        };
      }
    })
  );

  // TODO: Deley calculation as per SPI logic
  const response = {
    orgCreatedByUser,
    statusChartData,
    overallSituationChartData,
    projectsWithProjectManager,
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
  const projectId = uuidSchema.parse(req.params.projectId);

  // Fetch projects created by the user
  const prisma = await getClientByTenantId(req.tenantId);
  const projectWithTasks = await prisma.project.findFirstOrThrow({
    where: {
      projectId,
    },
    include: {
      tasks: {
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
  const projectProgression = await prisma.project.projectProgression(projectId);

  // CPI
  const cpi = prisma.project.calculationCPI(projectWithTasks);

  // SPI
  const tasksWithSPI = projectWithTasks.tasks.map(task => {
    const spi = prisma.task.calculationSPI(task);
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
    const tpiObj = prisma.task.tpiCalculation(task);
    return {
      taskId: task.taskId,
      taskName: task.taskName,
      tpiValue: tpiObj.tpiValue,
      tpiFlag: tpiObj.tpiFlag,
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
