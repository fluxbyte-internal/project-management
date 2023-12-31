import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { projectIdSchema } from '../schemas/projectSchema.js';
import { attachmentIdSchma, attachmentTaskSchema, commentIdSchma, createCommentTaskSchema, createTaskSchema, taskIdSchema, taskStatusSchema, updateTaskSchema } from '../schemas/taskSchema.js';
import { TaskService } from '../services/task.services.js';
import { TaskStatusEnum } from '@prisma/client';

export const getTasks = async (req: express.Request, res: express.Response) => {
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const tasks = await prisma.task.findMany({
    where: { projectId: projectId },
    orderBy: { createdAt: 'desc' }
  });
  return new SuccessResponse(StatusCodes.OK, tasks, 'get all task successfully').send(res);
};

export const getTaskById = async (req: express.Request, res: express.Response) => {
  const taskId = taskIdSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  const task = await prisma.task.findFirstOrThrow({
    where: { taskId: taskId },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
        include: { commentByUser: { select: { firstName: true, lastName: true, email: true } } }
      },
      documentAttachments: true,
      subtasks: true
    }
  });
  return new SuccessResponse(StatusCodes.OK, task, 'task selected').send(res);
};

export const createTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const {
    taskName,
    taskDescription,
    startDate,
    duration,
    documentAttachments,
    assginedToUserId,
    dependencies,
    flag,
    milestoneIndicator
  } = createTaskSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
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
      assginedToUserId: assginedToUserId,
      status: TaskStatusEnum.NOT_STARTED,
      parentTaskId: parentTaskId ? parentTaskId : null,
      createdByUserId: req.userId,
      updatedByUserId: req.userId,
      documentAttachments: {
        create: documentAttachments?.map((attachment) => ({
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
};

export const updateTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const tasktId = taskIdSchema.parse(req.params.taskId);
  const taskUpdateValue = updateTaskSchema.parse(req.body)
  const prisma = await getClientByTenantId(req.tenantId);
  const findtask = await prisma.task.findFirstOrThrow({
    where: { taskId: tasktId },
    include: {
      documentAttachments: true
    }
  });
  if (!findtask) { throw new NotFoundError('Task not found') }
  const newUpdateObj = { ...taskUpdateValue, updatedByUserId: req.userId };
  const taskUpdateDB = await prisma.task.update({
    where: { taskId: tasktId },
    data: { ...newUpdateObj, documentAttachments: {} },
  });

  // Calculate Task endDate
  const endDate = TaskService.calculateTaskEndDate(taskUpdateDB.startDate, taskUpdateDB.duration);

  return new SuccessResponse(StatusCodes.OK, { ...taskUpdateDB, endDate }, 'task updated successfully').send(res);
};

export const deleteTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = taskIdSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  if (taskId && await prisma.task.findFirstOrThrow({ where: { taskId: taskId } })) {
    await prisma.task.delete({
      where: { taskId },
      include: { comments: true, documentAttachments: true, subtasks: true }
    });
    return new SuccessResponse(StatusCodes.OK, {}, 'task deleted successfully').send(res);
  };
};

export const statusChangeTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = taskIdSchema.parse(req.params.taskId);
  const statusBody = taskStatusSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  if (taskId) {
    const findTask = await prisma.task.findFirstOrThrow({ where: { taskId: taskId } })
    let updatedTask = await prisma.task.update({
      where: { taskId: taskId },
      data: {
        status: statusBody.status,
        completionPecentage:
          statusBody.status === TaskStatusEnum.COMPLETED
            ? '100'
            : findTask.completionPecentage,
        updatedByUserId: req.userId
      },
    });
    return new SuccessResponse(StatusCodes.OK, updatedTask, 'task status change successfully').send(res);
  };
};

export const statusCompletedAllTAsk = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findAllTaskByProjectId = await prisma.task.findMany({ where: { projectId: projectId } });
  if (findAllTaskByProjectId.length > 0) {
    await prisma.task.updateMany({
      where: { projectId: projectId },
      data: { status: TaskStatusEnum.COMPLETED, completionPecentage: '100', updatedByUserId: req.userId }
    })
    return new SuccessResponse(StatusCodes.OK, {}, 'all task status change to completed successfully').send(res);
  };
  throw new NotFoundError('Tasks not found!');
};

export const addComment = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = taskIdSchema.parse(req.params.taskId);
  const { commentText } = createCommentTaskSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const comment = await prisma.comments.create({
    data: {
      taskId: taskId,
      commentByUserId: req.userId,
      commentText: commentText
    }
  });
  return new SuccessResponse(StatusCodes.CREATED, comment, 'comment added successfully').send(res);
};

export const updateComment = async (req: express.Request, res: express.Response) => {
  const commentId = commentIdSchma.parse(req.params.commentId);
  const { commentText } = createCommentTaskSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const findComment = await prisma.comments.findFirstOrThrow({ where: { commentId: commentId } });
  if (findComment) {
    await prisma.comments.update({
      where: { commentId: commentId },
      data: { commentText: commentText },
    });
    return new SuccessResponse(StatusCodes.OK, findComment, 'comment updated successfully').send(res);
  }
};

export const deleteComment = async (req: express.Request, res: express.Response) => {
  const commentId = commentIdSchma.parse(req.params.commentId);
  const prisma = await getClientByTenantId(req.tenantId);
  if (commentId && await prisma.comments.findFirstOrThrow({ where: { commentId: commentId } })) {
    await prisma.comments.delete({ where: { commentId } });
    return new SuccessResponse(StatusCodes.OK, {}, 'comment deleted successfully').send(res);
  };
};

export const updateAttachment = async (req: express.Request, res: express.Response) => {
  const attachemtnBody = attachmentTaskSchema.parse(req.body);
  const taskId = taskIdSchema.parse(req.params.taskId);
  // Todo: Need to do with blob and AWS S3
  const prisma = await getClientByTenantId(req.tenantId);
  attachemtnBody.map(async (data) => {
    if (data.attachmentId && await prisma.taskAttachment.findFirstOrThrow({ where: { attachmentId: data.attachmentId } })) {
      await prisma.taskAttachment.update({
        where: { attachmentId: data.attachmentId },
        data: { name: data.name, url: data.url },
      });
    } else {
      await prisma.taskAttachment.create({
        data: { name: data.name, url: data.url, taskId: taskId }
      });
    }
  });
  return new SuccessResponse(StatusCodes.OK, {}, 'Attachment updated successfully').send(res);
};

export const deleteAttachment = async (req: express.Request, res: express.Response) => {
  const attachmentId = attachmentIdSchma.parse(req.params.attachmentId);
  const prisma = await getClientByTenantId(req.tenantId);
  if (attachmentId && await prisma.taskAttachment.findFirstOrThrow({ where: { attachmentId: attachmentId } })) {
    await prisma.taskAttachment.delete({ where: { attachmentId } });
    return new SuccessResponse(StatusCodes.OK, {}, 'Attachment deleted successfully').send(res);
  };
};