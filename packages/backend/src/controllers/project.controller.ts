import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { createProjectSchema, projectIdSchema, updateProjectSchema } from '../schemas/projectSchema.js';
import { ProjectStatusEnum, TaskStatusEnum } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';
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
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const projects = await prisma.project.findFirstOrThrow({
      where: { organisationId: req.organisationId, projectId: projectId },
      include: { tasks: true }
    });
    const projectProgression = await ProjectService.calculateProjectProgressionPercentage(projectId, req.tenantId);
    return new SuccessResponse(StatusCodes.OK, { ...projects, projectProgression }, 'project selected').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        throw new NotFoundError(`no matches were found.`);
      }
    }
  }
};

export const createProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const {
    projectName,
    projectDescription,
    startDate,
    estimatedEndDate,
    estimatedBudget,
    defaultView
  } = createProjectSchema.parse(req.body);
  try {
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
        defaultView: defaultView
      }
    });
    return new SuccessResponse(StatusCodes.CREATED, project, 'project created successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientValidationError || PrismaClientKnownRequestError) {
      throw new BadRequestError(`A new project cannot be created`);
    }
  }
};

export const deleteProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId } });
    if (findProject) {
      await prisma.project.delete({ where: { projectId } });
      return new SuccessResponse(StatusCodes.OK, {}, 'project deleted successfully').send(res);
    }
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        throw new NotFoundError(`no project were found`);
      }
    }
  }
};

export const updateProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId } });
  let updateObj = { ...findProject, ...updateProjectSchema.parse(req.body) };
  try {
    const projectUpdate = await prisma.project.update({
      where: { projectId: projectId },
      data: { ...updateObj },
    });
    return new SuccessResponse(StatusCodes.OK, projectUpdate, 'project updated successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientValidationError || PrismaClientKnownRequestError) {
      throw new BadRequestError(`A project cannot be updated`);
    }
  }
};

export const statusChangeProject = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findProject = await prisma.project.findFirstOrThrow({ where: { projectId: projectId, organisationId: req.organisationId } });
  if (findProject) {
    const findTaskWithIncompleteTask = await prisma.task.findMany({ where: { projectId: projectId, status: TaskStatusEnum.NOT_STARTED } });
    if (findTaskWithIncompleteTask.length > 0) {
      throw new BadRequestError('Incomplete tasks exists!')
    };
  };
  try {
    await prisma.project.update({
      where: { projectId: projectId },
      data: { status: ProjectStatusEnum.CLOSED },
    });
    return new SuccessResponse(StatusCodes.OK, {}, 'project status change successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientValidationError || PrismaClientKnownRequestError) {
      throw new BadRequestError(`project status cannot be change`);
    }
  }
};