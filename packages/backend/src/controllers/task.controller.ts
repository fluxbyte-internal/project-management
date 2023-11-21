import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { projectIdSchema } from '../schemas/projectSchema.js';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library.js';
import { PRISMA_ERROR_CODE } from '../constants/prismaErrorCodes.js';
import { commentIdSchma, createCommentTaskSchema, createTaskSchema, taskIdSchema, taskStatusSchema, updateTaskSchema } from '../schemas/taskSchema.js';
import { TaskService } from '../services/task.services.js';

export const getTasks = async (req: express.Request, res: express.Response) => {
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const tasks = await prisma.task.findMany({
    where: { projectId: projectId }
  });
  return new SuccessResponse(StatusCodes.OK, tasks, 'get all task successfully').send(res);
};

export const getTaskById = async (req: express.Request, res: express.Response) => {
  const taskId = taskIdSchema.parse(req.params.taskId);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const task = await prisma.task.findFirstOrThrow({
      where: { taskId: taskId },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true, email: true } } }
        },
        documentAttachments: true,
        subtasks: true
      }
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
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const {
    taskName,
    taskDescription,
    startDate,
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
    const parentTaskId = req.params.parentTaskId as string;

    if (parentTaskId) {
      const parentTask = await prisma.task.findUnique({
        where: { taskId: parentTaskId },
      });
      if (!parentTask) { throw new NotFoundError('Parent task not found') };

      // Handle subtask not more then 3
      const countOfSubTasks = await TaskService.calculateSubTask(parentTaskId, req.tenantId);
      if (countOfSubTasks > 3) { throw new BadRequestError("Maximum limit of sub tasks reached") };

    };
    const endDate = TaskService.calculateTaskEndDate(startDate, duration);
    const task = await prisma.task.create({
      data: {
        projectId: projectId,
        taskName: taskName,
        taskDescription: taskDescription,
        duration: duration,
        startDate: startDate,
        milestoneIndicator: milestoneIndicator,
        dependencies: dependencies,
        flag: flag,
        assignee: assignee,
        status: status,
        parentTaskId: parentTaskId ? parentTaskId : null,
        documentAttachments: {
          create: documentAttachments.map((attachment) => ({
            name: attachment.name,
            url: attachment.url,
          })),
        },
      },
      include: {
        documentAttachments: true,
      },
    });
    return new SuccessResponse(StatusCodes.CREATED, { ...task, endDate }, 'task created successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientValidationError || PrismaClientKnownRequestError) {
      throw new BadRequestError(`A new task cannot be created, ${error}`);
    }
  }
};

export const updateTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const tasktId = taskIdSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findtask = await prisma.task.findFirstOrThrow({ where: { taskId: tasktId }, include: { documentAttachments: true } });
  let newUpdateObj = { ...findtask, ...updateTaskSchema.parse(req.body) };
  try {
    const taskUpdateDB = await prisma.task.update({
      where: { taskId: tasktId },
      data: { ...newUpdateObj, documentAttachments: {} },
    });
    const endDate = TaskService.calculateTaskEndDate(taskUpdateDB.startDate, taskUpdateDB.duration);
    return new SuccessResponse(StatusCodes.OK, { ...taskUpdateDB, endDate }, 'task updated successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientValidationError || PrismaClientKnownRequestError) {
      throw new BadRequestError(`A task cannot be updated`);
    }
  }
};

export const deleteTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = taskIdSchema.parse(req.params.taskId);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const findTask = await prisma.task.findFirstOrThrow({ where: { taskId: taskId } });
    if (findTask) {
      await prisma.task.delete({
        where: { taskId },
        include: { comments: true, documentAttachments: true, subtasks: true }
      });
      return new SuccessResponse(StatusCodes.OK, {}, 'task deleted successfully').send(res);
    };
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        throw new NotFoundError(`no task were found`);
      }
    }
  }
};

export const statusChangeTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = taskIdSchema.parse(req.params.taskId);
  const statusBody = taskStatusSchema.parse(req.body);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const findTask = await prisma.task.findFirstOrThrow({ where: { taskId: taskId } });
    if (findTask) {
      let updatedTask = await prisma.task.update({
        where: { taskId: taskId },
        data: { status: statusBody.status },
      });
      return new SuccessResponse(StatusCodes.OK, updatedTask, 'task status change successfully').send(res);
    };
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        throw new NotFoundError(`no task were found`);
      }
    }
  }
};

export const addComment = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = taskIdSchema.parse(req.params.taskId);
  const { commentText } = createCommentTaskSchema.parse(req.body);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const comment = await prisma.comments.create({
      data: {
        taskId: taskId,
        commentByUserId: req.userId,
        commentText: commentText
      }
    });
    return new SuccessResponse(StatusCodes.CREATED, comment, 'comment added successfully').send(res);
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientValidationError || error instanceof PrismaClientKnownRequestError) {
      throw new BadRequestError(`A new comment cannot be added`);
    }
  }
};

export const updateComment = async (req: express.Request, res: express.Response) => {
  const commentId = commentIdSchma.parse(req.params.commentId);
  const { commentText } = createCommentTaskSchema.parse(req.body);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const findComment = await prisma.comments.findFirstOrThrow({ where: { commentId: commentId } });
    if (findComment) {
      await prisma.comments.update({
        where: { commentId: commentId },
        data: { commentText: commentText },
      });
      return new SuccessResponse(StatusCodes.OK, findComment, 'comment updated successfully').send(res);
    }
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        throw new NotFoundError(`no comment were found`);
      }
    }
  }
};

export const deleteComment = async (req: express.Request, res: express.Response) => {
  const commentId = commentIdSchma.parse(req.params.commentId);
  try {
    const prisma = await getClientByTenantId(req.tenantId);
    const findComment = await prisma.comments.findFirstOrThrow({ where: { commentId: commentId } });
    if (findComment) {
      await prisma.comments.delete({ where: { commentId } });
      return new SuccessResponse(StatusCodes.OK, {}, 'comment deleted successfully').send(res);
    };
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
        throw new NotFoundError(`no comment were found`);
      }
    }
  }
};