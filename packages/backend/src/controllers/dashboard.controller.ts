import { Request, Response } from "express";
import { BadRequestError, SuccessResponse } from "../config/apiError.js";
import { StatusCodes } from "http-status-codes";
import { getClientByTenantId } from "../config/db.js";
import { ProjectOverAllTrackEnum, ProjectStatusEnum } from "@prisma/client";
import { StatusCounts } from "../types/statusCount.js";
import { uuidSchema } from "../schemas/commonSchema.js";

export const projectManagerProjects = async (req: Request, res: Response) => {
  const userId = req.userId;
  const prisma = await getClientByTenantId(req.tenantId);

  const projectManagersProjects = await prisma.project.findMany({
    where: {
      createdByUserId: userId,
    },
  });

  // Calculate Number of Portfolio Projects per Status
  const statusCounts: StatusCounts = projectManagersProjects.reduce(
    (acc, project) => {
      const status = project.status as ProjectStatusEnum;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as StatusCounts
  );

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

  const response = {
    projectManagersProjects,
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
  const statusCounts: StatusCounts = orgCreatedByUser.projects.reduce(
    (acc, project) => {
      const status = project.status as ProjectStatusEnum;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as StatusCounts
  );

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

export const allOrganisationsProjects = async (req: Request, res: Response) => {
  const prisma = await getClientByTenantId(req.tenantId);

  // Fetch all organizations with their projects
  const allOrganisationsWithProjects = await prisma.organisation.findMany({
    include: {
      projects: true,
    },
  });

  const allProjects = allOrganisationsWithProjects.flatMap(
    (org) => org.projects
  );

  // Calculate Number of Projects per Status
  const statusCounts: StatusCounts = allProjects.reduce((acc, project) => {
    const status = project.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as StatusCounts);

  // Calculate Number of Projects per Overall Situation
  const overallSituationCounts: StatusCounts = allProjects.reduce(
    (acc, project) => {
      const overallSituation = project.overallTrack;
      acc[overallSituation] = (acc[overallSituation] || 0) + 1;
      return acc;
    },
    {} as StatusCounts
  );

  // Prepare data for the status chart
  const statusChartData = {
    labels: Object.keys(statusCounts),
    data: Object.values(statusCounts),
  };

  // Prepare data for the overall situation chart
  const overallSituationChartData = {
    labels: Object.keys(overallSituationCounts),
    data: Object.values(overallSituationCounts),
  };

  const response = {
    allOrganisationsWithProjects,
    statusChartData,
    overallSituationChartData,
  };

  return new SuccessResponse(
    StatusCodes.OK,
    response,
    "Portfolio projects of all Organisations"
  ).send(res);
};

export const projectDashboardByprojectId = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  const projectId = uuidSchema.parse(req.params.projectId);

  // Fetch projects created by the user
  const prisma = await getClientByTenantId(req.tenantId);
  const projectWithTasks = await prisma.project.findFirstOrThrow({
    where: {
      projectId,
    },
    include: {
      tasks: true,
    },
  });

  // Count the number of task for the project
  const numTasks = projectWithTasks.tasks.length;

  // Calculate the number of milestones for the project
  const numMilestones = projectWithTasks.tasks.reduce(
    (acc, task) => acc + (task.milestoneIndicator ? 1 : 0),
    0
  );

  const response = {
    numTasks,
    numMilestones,
  };
  return new SuccessResponse(
    StatusCodes.OK,
    response,
    "Portfolio for selected project"
  ).send(res);
};
