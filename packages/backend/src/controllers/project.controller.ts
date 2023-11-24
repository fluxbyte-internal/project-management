import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { createProjectSchema, projectIdSchema, projectStatusSchema, updateProjectSchema } from '../schemas/projectSchema.js';
import { ProjectStatusEnum, TaskStatusEnum } from '@prisma/client';
import { ProjectService } from '../services/project.services.js';

export const getProjects = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const prisma = await getClientByTenantId(req.tenantId);
  const projects = await prisma.project.findMany({ where: { organisationId: req.organisationId }, orderBy: { createdAt: 'desc' } });
  return new SuccessResponse(StatusCodes.OK, projects, 'get all project successfully').send(res);
};

export const getProjectById = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const projects = await prisma.project.findFirstOrThrow({
    where: { organisationId: req.organisationId, projectId: projectId },
    include: { tasks: true }
  });
  const projectProgression = await ProjectService.calculateProjectProgressionPercentage(projectId, req.tenantId);
  return new SuccessResponse(StatusCodes.OK, { ...projects, projectProgression }, 'project selected').send(res);
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
    defaultView
  } = createProjectSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const project = await prisma.project.create({
    data: {
      organisationId: req.organisationId,
      projectName: projectName,
      projectDescription: projectDescription,
      startDate: startDate,
      estimatedEndDate: estimatedEndDate,
      status: ProjectStatusEnum.NOT_STARTED,
      estimatedBudget: estimatedBudget,
      defaultView: defaultView,
      createdByUserId: req.userId
    }
  });
  return new SuccessResponse(StatusCodes.CREATED, project, 'project created successfully').send(res);
};

export const deleteProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId } });
  if (findProject) {
    await prisma.project.delete({ where: { projectId } });
    return new SuccessResponse(StatusCodes.OK, {}, 'project deleted successfully').send(res);
  }
};

export const updateProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  if (!req.userId) { throw new BadRequestError('userId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId } });
  let updateObj = { ...findProject, ...updateProjectSchema.parse(req.body), updatedByUserId: req.userId };
  const projectUpdate = await prisma.project.update({
    where: { projectId: projectId },
    data: { ...updateObj },
  });
  return new SuccessResponse(StatusCodes.OK, projectUpdate, 'project updated successfully').send(res);
};

export const statusChangeProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  if (!req.userId) { throw new BadRequestError('userId not found!') };
  const { status } = projectStatusSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId } });
  if (findProject) {
    const findTaskWithIncompleteTask = await prisma.task.findMany({ where: { projectId: projectId, status: TaskStatusEnum.NOT_STARTED } });
    if (findTaskWithIncompleteTask.length > 0 && status === ProjectStatusEnum.CLOSED) {
      throw new BadRequestError('Incomplete tasks exists!')
    };
  };
  const updateProject = await prisma.project.update({
    where: { projectId: projectId },
    data: { status: status, updatedByUserId: req.userId },
  });
  return new SuccessResponse(StatusCodes.OK, updateProject, 'project status change successfully').send(res);
};