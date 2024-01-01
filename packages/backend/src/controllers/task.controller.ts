import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, NotFoundError, SuccessResponse } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { projectIdSchema } from '../schemas/projectSchema.js';
import { createCommentTaskSchema, createTaskSchema, attachmentTaskSchema, taskStatusSchema, updateTaskSchema, assginedToUserIdSchema, dependenciesTaskSchema, milestoneTaskSchema } from '../schemas/taskSchema.js';
import { TaskService } from '../services/task.services.js';
import { TaskStatusEnum } from '@prisma/client';
import { AwsUploadService } from '../services/aws.services.js';
import { uuidSchema } from '../schemas/commonSchema.js';
import { HistoryService } from '../services/history.services.js';
import { HistoryTypeEnumValue } from '../schemas/enums.js';
import { removeProperties } from '../types/removeProperties.js';

export const getTasks = async (req: express.Request, res: express.Response) => {
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const tasks = await prisma.task.findMany({
    where: { projectId: projectId },
    orderBy: { createdAt: 'desc' },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              avatarImg: true
            }
          }
        }
      }
    }
  });
  return new SuccessResponse(StatusCodes.OK, tasks, 'get all task successfully').send(res);
};

export const getTaskById = async (req: express.Request, res: express.Response) => {
  const taskId = uuidSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  const task = await prisma.task.findFirstOrThrow({
    where: { taskId: taskId },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          commentByUser: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              avatarImg: true,
            },
          },
        },
      },
      assignedUsers: {
        select: {
          taskAssignUsersId: true,
          user:{
            select: {
              userId: true,
              avatarImg: true, 
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      },
      documentAttachments: true,
      subtasks: true,
      dependencies: {
        include: {
          dependentOnTask: true,
        },
      },
      histories: {
        orderBy: { createdAt: "desc" },
        include: {
          createdByUser: {
            select: {
              avatarImg: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  const finalResponse = { ...task };
  return new SuccessResponse(
    StatusCodes.OK,
    finalResponse,
    "task selected"
  ).send(res);
};

export const createTask = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const { taskName, taskDescription, startDate, duration } =
    createTaskSchema.parse(req.body);
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
  const task = await prisma.task.create({
    data: {
      projectId: projectId,
      taskName: taskName,
      taskDescription: taskDescription,
      duration: duration,
      startDate: startDate,
      status: TaskStatusEnum.NOT_STARTED,
      parentTaskId: parentTaskId ? parentTaskId : null,
      createdByUserId: req.userId,
      updatedByUserId: req.userId,
    },
    include: {
      documentAttachments: true,
      assignedUsers: true,
      dependencies: true
    },
  });

  const fieldEntries = [];
  if (parentTaskId) {
    fieldEntries.push({
      message: `Subtask was created`,
      value: { oldValue: null, newValue: taskName },
    });
  } else {
    fieldEntries.push({
      message: `Task was created`,
      value: { oldValue: null, newValue: taskName },
    });
  }

  for (const [fieldName, fieldSchema] of Object.entries(
    createTaskSchema.parse(req.body)
  )) {
    if (fieldName !== "taskName" && fieldName !== "taskDescription") {
      const fieldValue = req.body[fieldName];

      if (
        fieldValue !== undefined &&
        fieldValue !== null &&
        !(fieldName === "duration" && fieldValue === 0)
      ) {
        const message = parentTaskId
          ? `Subtask's ${fieldName} was added`
          : `Task's ${fieldName} was added`;

        fieldEntries.push({
          message: message,
          value: { oldValue: null, newValue: fieldValue },
        });
      }
    }
  }
  for (const entry of fieldEntries) {
    await HistoryService.createHistory(
      req.userId,
      req.tenantId,
      HistoryTypeEnumValue.TASK,
      entry.message,
      entry.value,
      parentTaskId ? parentTaskId : task.taskId
    );
  }
  const finalResponse = { ...task };
  return new SuccessResponse(
    StatusCodes.CREATED,
    finalResponse,
    "task created successfully"
  ).send(res);
};

export const updateTask = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);
  const taskUpdateValue = updateTaskSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const findtask = await prisma.task.findFirstOrThrow({
    where: { taskId: taskId },
    include: {
      documentAttachments: true,
      assignedUsers: true,
    },
  });
  const taskUpdateDB = await prisma.task.update({
    where: { taskId: taskId },
    data: {
      ...taskUpdateValue,
      updatedByUserId: req.userId,
    },
    include: {
      documentAttachments: true,
      assignedUsers: true,
      dependencies: true,
    },
  });

  // History-Manage
  const updatedValueWithoutOtherTable = removeProperties(
    taskUpdateDB as Record<string, any>,
    [
      "documentAttachments",
      "assignedUsers",
      "dependencies",
      "milestoneIndicator",
    ]
  );

  const findTaskWithoutOtherTable = removeProperties(
    findtask as Record<string, any>,
    [
      "documentAttachments",
      "assignedUsers",
      "dependencies",
      "milestoneIndicator",
    ]
  );

  for (const key in taskUpdateValue) {
    if (updatedValueWithoutOtherTable[key] !== findTaskWithoutOtherTable[key]) {
      const historyMessage = `Task's ${key} was changed`;
      const historyData = {
        oldValue: findTaskWithoutOtherTable[key],
        newValue: updatedValueWithoutOtherTable[key],
      };
      if (
        key === "startDate" &&
        historyData.newValue instanceof Date &&
        historyData.oldValue instanceof Date &&
        historyData.newValue.getTime() !== historyData.oldValue.getTime()
      ) {
        await HistoryService.createHistory(
          req.userId,
          req.tenantId,
          HistoryTypeEnumValue.TASK,
          historyMessage,
          historyData,
          taskId
        );
      }
    }
  }

  const finalResponse = { ...taskUpdateDB };
  return new SuccessResponse(
    StatusCodes.OK,
    finalResponse,
    "task updated successfully"
  ).send(res);
};

export const deleteTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = uuidSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  if (taskId && await prisma.task.findFirstOrThrow({ where: { taskId: taskId } })) {
    await prisma.task.delete({
      where: { taskId },
      include: { 
        comments: true, 
        documentAttachments: true, 
        subtasks: true,
        dependencies: true,
      }
    });
    return new SuccessResponse(StatusCodes.OK, null, 'task deleted successfully').send(res);
  };
};

export const statusChangeTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = uuidSchema.parse(req.params.taskId);
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

    // History-Manage
    const historyMessage = "Task’s status was changed";
    const historyData = {
      oldValue: findTask.status,
      newValue: statusBody.status,
    };
    await HistoryService.createHistory(
      req.userId,
      req.tenantId,
      HistoryTypeEnumValue.TASK,
      historyMessage,
      historyData,
      taskId
    );

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

    // History-Manage
    for (const task of findAllTaskByProjectId) {
      const historyMessage = "Task’s status was changed";
      const historyNewValue = {
        oldValue: task.status,
        newValue: TaskStatusEnum.COMPLETED,
      };
      await HistoryService.createHistory(
        req.userId,
        req.tenantId,
        HistoryTypeEnumValue.TASK,
        historyMessage,
        historyNewValue,
        task.taskId
      );
    };

    return new SuccessResponse(StatusCodes.OK, null, 'all task status change to completed successfully').send(res);
  };
  throw new NotFoundError('Tasks not found!');
};

export const addComment = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = uuidSchema.parse(req.params.taskId);
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
  const commentId = uuidSchema.parse(req.params.commentId);
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
  const commentId = uuidSchema.parse(req.params.commentId);
  const prisma = await getClientByTenantId(req.tenantId);
  if (commentId && await prisma.comments.findFirstOrThrow({ where: { commentId: commentId } })) {
    await prisma.comments.delete({ where: { commentId } });
    return new SuccessResponse(StatusCodes.OK, null, 'comment deleted successfully').send(res);
  };
};

export const addAttachment = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);

  let files = [];
  const taskAttachmentFiles = attachmentTaskSchema.parse(
    req.files?.taskAttachment
  );
  if (Array.isArray(taskAttachmentFiles)) {
    files = taskAttachmentFiles;
  } else {
    files.push(taskAttachmentFiles);
  };
  const prisma = await getClientByTenantId(req.tenantId);

  for (const singleFile of files) {
    const taskAttachmentURL = await AwsUploadService.uploadFileWithContent(
      `${req.userId}-${singleFile?.name}`,
      singleFile?.data,
      "task-attachment"
    );
    await prisma.taskAttachment.create({
      data: {
        taskId: taskId,
        url: taskAttachmentURL,
        name: singleFile.name,
      },
    });

    // History-Manage
    const historyMessage = "Task's attachment was added";
    const historyData = { oldValue: null, newValue: taskAttachmentURL };
    await HistoryService.createHistory(
      req.userId,
      req.tenantId,
      HistoryTypeEnumValue.TASK,
      historyMessage,
      historyData,
      taskId
    );
  }

  const findTask = await prisma.task.findFirst({
    where: { taskId: taskId },
    include: { documentAttachments: true },
  });

  return new SuccessResponse(
    StatusCodes.CREATED,
    findTask,
    "Add attachment successfully"
  ).send(res);
};

export const deleteAttachment = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const attachmentId = uuidSchema.parse(req.params.attachmentId);
  const prisma = await getClientByTenantId(req.tenantId);
  const attachment = await prisma.taskAttachment.findFirstOrThrow({
    where: { attachmentId: attachmentId },
  });

  //TODO: If Delete require on S3
  // await AwsUploadService.deleteFile(attachment.name, 'task-attachment');
  await prisma.taskAttachment.delete({ where: { attachmentId } });

  // History-Manage
  const historyMessage = "Task's attachment was removed";
  const historyData = { oldValue: attachment.url, newValue: null };
  await HistoryService.createHistory(
    req.userId,
    req.tenantId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    attachment.taskId
  );

  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Attachment deleted successfully"
  ).send(res);
};

export const taskAssignToUser = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!");
  }
  const prisma = await getClientByTenantId(req.tenantId);
  const usersOfOrganisation = await prisma.userOrganisation.findMany({
    where: { organisationId: req.organisationId },
    select: {
      jobTitle: true,
      organisationId: true,
      role: true,
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

export const addMemberToTask = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = uuidSchema.parse(req.params.taskId);
  const { assginedToUserId } = assginedToUserIdSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const member = await prisma.taskAssignUsers.create({
    data: {
      assginedToUserId: assginedToUserId,
      taskId: taskId
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  // History-Manage
  const historyMessage = "Task's assignee was added";
  const historyData = { oldValue: null, newValue: member.user?.email };
  await HistoryService.createHistory(
    req.userId,
    req.tenantId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    member.taskId
  );

  return new SuccessResponse(
    StatusCodes.CREATED,
    member,
    "Member added successfully"
  ).send(res);
};

export const deleteMemberFromTask = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskAssignUsersId = uuidSchema.parse(req.params.taskAssignUsersId);
  const prisma = await getClientByTenantId(req.tenantId);
  const deletedMember = await prisma.taskAssignUsers.delete({
    where: {
      taskAssignUsersId: taskAssignUsersId,
    },
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  });

  // History-Manage
  const historyMessage = "Task's assignee was removed";
  const historyData = { oldValue: deletedMember.user?.email, newValue: null };
  await HistoryService.createHistory(
    req.userId,
    req.tenantId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    deletedMember.taskId
  );

  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Member deleted successfully"
  ).send(res);
};

export const addDependencies = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const taskId = uuidSchema.parse(req.params.taskId);
  const { dependentType, dependendentOnTaskId } = dependenciesTaskSchema.parse(
    req.body
  );
  const prisma = await getClientByTenantId(req.tenantId);
  const addDependencies = await prisma.taskDependencies.create({
    data: {
      dependentType: dependentType,
      dependentTaskId: taskId,
      dependendentOnTaskId: dependendentOnTaskId,
    },
  });

  // History-Manage
  const historyMessage = "Task’s dependency was added";
  const historyData = { oldValue: null, newValue: dependentType };
  await HistoryService.createHistory(
    req.userId,
    req.tenantId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    taskId
  );

  return new SuccessResponse(
    StatusCodes.OK,
    addDependencies,
    "Dependencies added successfully"
  ).send(res);
};

export const removeDependencies = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskDependenciesId = uuidSchema.parse(req.params.taskDependenciesId);
  const prisma = await getClientByTenantId(req.tenantId);
  const deletedDependencies = await prisma.taskDependencies.delete({
    where: {
      taskDependenciesId: taskDependenciesId,
    },
  });

  // History-Manage
  const historyMessage = "Task’s dependency was removed";
  const historyData = { oldValue: taskDependenciesId, newValue: null };
  await HistoryService.createHistory(
    req.userId,
    req.tenantId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    deletedDependencies.dependentTaskId
  );

  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "Dependencies removed successfully"
  ).send(res);
};

export const addOrRemoveMilesstone = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);
  const { milestoneIndicator, dueDate } = milestoneTaskSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const milestone = await prisma.task.update({
    data: {
      milestoneIndicator: milestoneIndicator,
      dueDate: milestoneIndicator ? dueDate : null,
    },
    where: {
      taskId: taskId,
    },
  });

  // History-Manage
  const milestoneMessage = milestoneIndicator ? "converted" : "reverted";
  const historyMessage = `Task was ${milestoneMessage} as a milestone`;
  const isMilestone = milestoneIndicator;
  const historyData = {
    oldValue: isMilestone ? null : "true",
    newValue: isMilestone ? "true" : "false",
  };
  await HistoryService.createHistory(
    req.userId,
    req.tenantId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    taskId
  );

  return new SuccessResponse(
    StatusCodes.OK,
    milestone,
    "Milestone updated successfully"
  ).send(res);
};
