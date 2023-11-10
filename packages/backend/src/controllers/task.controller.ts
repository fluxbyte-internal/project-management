import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { projectIdSchema } from '../schemas/projectSchema.js';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';
import { createTaskSchema, taskIdSchema } from '../schemas/taskSchema.js';

export const getTasks = async (req: express.Request, res: express.Response) => {
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const tasks = await prisma.task.findMany({ where: { projectId: projectId } });
  return new SuccessResponse(StatusCodes.OK, tasks, 'get all task successfully').send(res);
};

export const getTaskById = async (req: express.Request, res: express.Response) => {
  const taskId = taskIdSchema.parse(req.params.taskId);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const task = await prisma.task.findFirstOrThrow({
      where: { taskId: taskId }
    });
    return new SuccessResponse(StatusCodes.OK, task, 'task selected').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        throw new NotFoundError(`no matches were found`);
      }
    }
  }
};

export const createTask = async (req: express.Request, res: express.Response) => {
  const {
    taskName,
    taskDescription,
    startDate,
    endDate,
    duration,
    documentAttachments,
    assignee,
    dependencies,
    flag,
    milestoneIndicator,
    status
  } = createTaskSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const parentTaskId = req.query.parentTaskId as string;

    if (parentTaskId) {
      const parentTask = await prisma.task.findUnique({
        where: { taskId: parentTaskId },
      });
      if (!parentTask) { throw new NotFoundError('Parent task not found') };
      let count = 3; // Need to call one service here dev_hitesh
      if (count > 3) {
        throw new BadRequestError(`Already have more then 3 tasks. total task is ${count}`)
      }
    };
    const task = await prisma.task.create({
      data: {
        projectId: projectId,
        taskName: taskName,
        taskDescription: taskDescription,
        duration: duration,
        startDate: startDate,
        endDate: endDate,
        milestoneIndicator: milestoneIndicator,
        dependencies: dependencies,
        flag: flag,
        documentAttachments: documentAttachments,
        assignee: assignee,
        status: status,
        parentTaskId: parentTaskId ? parentTaskId : null
      },
    });
    return new SuccessResponse(StatusCodes.CREATED, task, 'task created successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientValidationError || error instanceof PrismaClientKnownRequestError) {
      throw new BadRequestError(`A new task cannot be created`);
    }
  }
};

export const deleteTask = async (req: express.Request, res: express.Response) => {
  const taskId = taskIdSchema.parse(req.params.taskId);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const findTask = await prisma.task.findFirstOrThrow({ where: { taskId: taskId } });
    if (findTask) {
      await prisma.task.delete({ where: { taskId } });
      return new SuccessResponse(StatusCodes.OK, {}, 'task deleted successfully').send(res);
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