import express from 'express';
import { getClientByTenantId } from '../config/db.js';
import { BadRequestError, NotFoundError, SuccessResponse, UnAuthorizedError } from '../config/apiError.js';
import { StatusCodes } from 'http-status-codes';
import { projectIdSchema } from '../schemas/projectSchema.js';
import { createCommentTaskSchema, createTaskSchema, attachmentTaskSchema, taskStatusSchema, updateTaskSchema, assginedToUserIdSchema, dependenciesTaskSchema, milestoneTaskSchema } from '../schemas/taskSchema.js';
import { NotificationTypeEnum, TaskStatusEnum, UserStatusEnum } from '@prisma/client';
import { AwsUploadService } from '../services/aws.services.js';
import { uuidSchema } from '../schemas/commonSchema.js';
import { MilestoneIndicatorStatusEnum } from '@prisma/client';
import { HistoryTypeEnumValue } from '../schemas/enums.js';
import { removeProperties } from "../types/removeProperties.js";
import { taskEndDate } from '../utils/calcualteTaskEndDate.js';
import { selectUserFields } from '../utils/selectedFieldsOfUsers.js';
import { calculationSubTaskProgression } from '../utils/calculationSubTaskProgression.js';
import { taskFlag } from '../utils/calculationFlag.js';
import { calculateProjectEndDate } from '../utils/calculateProjectEndDate.js';
import { calculateDurationAndPercentage, checkTaskStatus } from '../utils/taskRecursion.js';

export const getTasks = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!!");
  }
  const organisationId = req.organisationId;
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const tasks = await prisma.task.findMany({
    where: { projectId: projectId, deletedAt: null },
    orderBy: { createdAt: 'desc' },include: {
      assignedUsers: {
        where: { deletedAt: null },
        select: {
          taskAssignUsersId: true,
          user:{
            select: selectUserFields,
          }
        }
      },
      subtasks: {
        where: { deletedAt: null },
        include: {
          subtasks: {
            where: { deletedAt: null },
            include: {
              subtasks: true,
            },
          },
        },
      },
      dependencies: true
    },
  });
  const finalArray = await Promise.all(tasks.map(async (task) => {
    const endDate = await taskEndDate(task, req.tenantId, organisationId);
    const completionPecentage = await calculationSubTaskProgression(task, req.tenantId, organisationId) ?? 0;
    const {flag, delay } = await taskFlag(task, req.tenantId, organisationId);
    const updatedTask = {
      ...task,
      flag,
      delay,
      endDate,
      completionPecentage,
    };
    return updatedTask;
  }));

  return new SuccessResponse(StatusCodes.OK, finalArray, 'get all task successfully').send(res);
};

export const getTaskById = async (req: express.Request, res: express.Response) => {
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  const task = await prisma.task.findFirstOrThrow({
    where: { taskId: taskId, deletedAt: null },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          commentByUser: {
            select: selectUserFields,
          },
        },
      },
      assignedUsers: {
        where: { deletedAt: null },
        select: {
          taskAssignUsersId: true,
          user:{
            select: selectUserFields,
          }
        }
      },
      documentAttachments: {
        where: { deletedAt: null }
      },
      subtasks: {
        where: { deletedAt: null },
        include: {
          subtasks: {
            where: { deletedAt: null },
            include: {
              subtasks: true,
            },
          },
        },
      },
      dependencies: {
        where: { deletedAt: null },
        include: {
          dependentOnTask: true,
        },
      },
      histories: {
        orderBy: { createdAt: "desc" },
        include: {
          createdByUser: {
            select: selectUserFields,
          },
        },
      },
    },
  });
  const endDate = await taskEndDate(task, req.tenantId, req.organisationId);
  const completionPecentage = await calculationSubTaskProgression(task, req.tenantId, req.organisationId) ?? 0;
  const {flag, delay} = await taskFlag(task, req.tenantId, req.organisationId);
  const finalResponse = { ...task, completionPecentage, flag, endDate, delay };
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
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!!");
  }
  const { taskName, taskDescription, startDate, duration } =
    createTaskSchema.parse(req.body);
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const parentTaskId = req.params.parentTaskId as string;

  const findTask = await prisma.task.findFirst({
    where: {
      projectId,
      taskName,
    }
  });
  if(findTask) {
    throw new BadRequestError("A task with a similar name already exists!")
  }

  if (parentTaskId) {
    const parentTask = await prisma.task.findUnique({
      where: { taskId: parentTaskId, deletedAt: null },
    });
    if (!parentTask) { throw new NotFoundError('Parent task not found') };

    // Handle subtask not more then 3
    const countOfSubTasks = await prisma.task.calculateSubTask(parentTaskId);
    if (countOfSubTasks > 3) { throw new BadRequestError("Maximum limit of sub tasks reached") };

  };
  const task = await prisma.task.create({
    data: {
      projectId: projectId,
      taskName: taskName,
      taskDescription: taskDescription,
      duration: duration,
      startDate: startDate,
      parentTaskId: parentTaskId ? parentTaskId : null,
      createdByUserId: req.userId,
      updatedByUserId: req.userId,
      completionPecentage: 0 // By defualt percentage will be zero : dev_hitesh
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
        !(fieldName === "duration" && fieldValue === 0) &&
        !(fieldName === "duration" && fieldValue === 1)
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
    await prisma.history.createHistory(
      req.userId,
      HistoryTypeEnumValue.TASK,
      entry.message,
      entry.value,
      parentTaskId ? parentTaskId : task.taskId
    );
  }
  const statusHandle = await checkTaskStatus(task.taskId, req.tenantId, req.organisationId);
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
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);
  const taskUpdateValue = updateTaskSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const action = await prisma.task.canEditOrDelete(taskId, req.userId);
  if (!action) {
    throw new UnAuthorizedError();
  }
  const findtask = await prisma.task.findFirstOrThrow({
    where: { taskId: taskId, deletedAt: null },
    include: {
      documentAttachments: true,
      assignedUsers: true,
      subtasks: true,
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
      project: true,
      parent: true,
      subtasks: true,
    },
  });

  // Handle - parent- duration and end date
  if (taskUpdateDB.parent?.taskId) {
    await calculateDurationAndPercentage(
      taskUpdateDB.parent.taskId,
      req.tenantId,
      req.organisationId
    );
  }

  // Project End Date  -  If any task's end date will be greater then It's own
  const maxEndDate = await calculateProjectEndDate(
    taskUpdateDB.projectId,
    req.tenantId,
    req.organisationId!
  );
  if (maxEndDate) {
    await prisma.project.update({
      where: {
        projectId: taskUpdateDB.project.projectId,
      },
      data: {
        actualEndDate: maxEndDate,
      },
    });
  }

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
        await prisma.history.createHistory(
          req.userId,
          HistoryTypeEnumValue.TASK,
          historyMessage,
          historyData,
          taskId
        );
      } else if (key !== "startDate") {
        await prisma.history.createHistory(
          req.userId,
          HistoryTypeEnumValue.TASK,
          historyMessage,
          historyData,
          taskId
        );
      }
    }
  }
  const statusHandle = await checkTaskStatus(taskId, req.tenantId, req.organisationId);

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
  const action = await prisma.task.canEditOrDelete(taskId, req.userId);
  if (!action) {
    throw new UnAuthorizedError();
  }

  await prisma.task.delete({
    where: { taskId },
    include: {
      comments: true,
      documentAttachments: true,
      subtasks: true,
      dependencies: true,
    },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "task deleted successfully"
  ).send(res);
};

export const statusChangeTask = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  if (!req.organisationId) { throw new BadRequestError('organisationId not found!!') };
  const taskId = uuidSchema.parse(req.params.taskId);
  const statusBody = taskStatusSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  if (taskId) {
    const findTask = await prisma.task.findFirstOrThrow({ where: { taskId: taskId, deletedAt: null } })
    let completionPercentage = 0;
    if (statusBody.status === TaskStatusEnum.COMPLETED) {
      completionPercentage = 100;
    }else if (findTask.milestoneIndicator && statusBody.status === TaskStatusEnum.NOT_STARTED) {
      completionPercentage = 0;
    } else if( statusBody.status === TaskStatusEnum.IN_PROGRESS){
      completionPercentage = 50
    }
    let updatedTask = await prisma.task.update({
      where: { taskId: taskId },
      data: {
        status: statusBody.status,
        milestoneStatus:
          statusBody.status === TaskStatusEnum.COMPLETED
            ? MilestoneIndicatorStatusEnum.COMPLETED
            : MilestoneIndicatorStatusEnum.NOT_STARTED,
        completionPecentage:completionPercentage,
        updatedByUserId: req.userId
      },
    });

  // History-Manage
  const historyMessage = "Task’s status was changed";
  const historyData = {
    oldValue: findTask.status,
    newValue: statusBody.status,
  };
  await prisma.history.createHistory(
    req.userId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    taskId
  );
  const statusHandle = await checkTaskStatus(taskId, req.tenantId, req.organisationId);

  return new SuccessResponse(
    StatusCodes.OK,
    updatedTask,
    "task status change successfully"
  ).send(res);
};
}

export const statusCompletedAllTAsk = async (req: express.Request, res: express.Response) => {
  if (!req.userId) { throw new BadRequestError('userId not found!!') };
  const projectId = projectIdSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const findAllTaskByProjectId = await prisma.task.findMany({
    where: { projectId: projectId, deletedAt: null }
  });
  if (findAllTaskByProjectId.length > 0) {
    await prisma.task.updateMany({
      where: { projectId: projectId },
      data: {
        status: TaskStatusEnum.COMPLETED,
        completionPecentage: 100,
        updatedByUserId: req.userId
      }
    })

    // History-Manage
    for (const task of findAllTaskByProjectId) {
      const historyMessage = "Task’s status was changed";
      const historyNewValue = {
        oldValue: task.status,
        newValue: TaskStatusEnum.COMPLETED,
      };
      await prisma.history.createHistory(
        req.userId,
        HistoryTypeEnumValue.TASK,
        historyMessage,
        historyNewValue,
        task.taskId
      );
    }

    return new SuccessResponse(
      StatusCodes.OK,
      null,
      "all task status change to completed successfully"
    ).send(res);
  }
  throw new NotFoundError("Tasks not found!");
};

export const addComment = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);
  const { commentText } = createCommentTaskSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  // const action = await prisma.task.canCreate(taskId, req.userId);
  // if (!action) {
  //   throw new UnAuthorizedError();
  // }
  const comment = await prisma.comments.create({
    data: {
      taskId: taskId,
      commentByUserId: req.userId,
      commentText: commentText
    }
  });
  return new SuccessResponse(
    StatusCodes.CREATED,
    comment,
    "comment added successfully"
  ).send(res);
};

export const updateComment = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const commentId = uuidSchema.parse(req.params.commentId);
  const { commentText } = createCommentTaskSchema.parse(req.body);
  const prisma = await getClientByTenantId(req.tenantId);
  const action = await prisma.comments.canEditOrDelete(
    commentId,
    req.userId
  );
  if (!action) {
    throw new UnAuthorizedError();
  }
  const updated = await prisma.comments.update({
    where: { commentId: commentId },
    data: { commentText: commentText },
  });
  return new SuccessResponse(
    StatusCodes.OK,
    updated,
    "comment updated successfully"
  ).send(res);
};

export const deleteComment = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const commentId = uuidSchema.parse(req.params.commentId);
  const prisma = await getClientByTenantId(req.tenantId);
  const action = await prisma.comments.canEditOrDelete(
    commentId,
    req.userId
  );
  if (!action) {
    throw new UnAuthorizedError();
  }
  await prisma.comments.delete({ where: { commentId } });
  return new SuccessResponse(
    StatusCodes.OK,
    null,
    "comment deleted successfully"
  ).send(res);
};

export const addAttachment = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);

  const prisma = await getClientByTenantId(req.tenantId);
  const action = await prisma.task.canCreate(taskId, req.userId);
  if (!action) {
    throw new UnAuthorizedError();
  }
  let files = [];
  const taskAttachmentFiles = attachmentTaskSchema.parse(
    req.files?.taskAttachment
  );
  if (Array.isArray(taskAttachmentFiles)) {
    files = taskAttachmentFiles;
  } else {
    files.push(taskAttachmentFiles);
  };

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
        uploadedBy: req.userId
      },
    });

    // History-Manage
    const historyMessage = "Task's attachment was added";
    const historyData = { oldValue: null, newValue: singleFile.name };
    await prisma.history.createHistory(
      req.userId,
      HistoryTypeEnumValue.TASK,
      historyMessage,
      historyData,
      taskId
    );
  }

  const findTask = await prisma.task.findFirst({
    where: { taskId: taskId, deletedAt: null },
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
  const action = await prisma.taskAttachment.canDelete(
    attachmentId,
    req.userId
  );
  if (!action) {
    throw new UnAuthorizedError();
  }
  //TODO: If Delete require on S3
  // await AwsUploadService.deleteFile(attachment.name, 'task-attachment');
  // const deletedAttachment = await prisma.taskAttachment.delete({ where: { attachmentId } });
  const deletedAttachment = await prisma.taskAttachment.update({
    where: { attachmentId },
    data: {
      deletedAt: new Date(),
    },
  });

  // History-Manage
  const historyMessage = "Task's attachment was removed";
  const historyData = { oldValue: deletedAttachment.name, newValue: null };
  await prisma.history.createHistory(
    req.userId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    deletedAttachment.taskId
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
  const projectId = uuidSchema.parse(req.params.projectId);
  const prisma = await getClientByTenantId(req.tenantId);
  const usersOfOrganisation = await prisma.projectAssignUsers.findMany({
    where: {
      projectId,
      user: {
        status: UserStatusEnum.ACTIVE,
      },
    },
    select: {
      projectId: true,
      assginedToUserId: true,
      projectAssignUsersId: true,
      user: {
        select: {
          ...selectUserFields,
          userOrganisation: {
            select: {
              role: true,
            },
          },
        },
      },
    },
  });
  const activeUsers = usersOfOrganisation.filter(
    (user) => user.user.status === UserStatusEnum.ACTIVE
  );
  return new SuccessResponse(
    StatusCodes.OK,
    activeUsers,
    "Get project's users successfully"
  ).send(res);
};

export const addMemberToTask = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }

  const taskId = uuidSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  const action = await prisma.task.canEditOrDelete(taskId, req.userId);
  if (!action) {
    throw new UnAuthorizedError();
  }
  const { assginedToUserId } = assginedToUserIdSchema.parse(req.body);
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

  //Send notification 
  const message = `Task assigned to you`;
  await prisma.notification.sendNotification(
    NotificationTypeEnum.TASK,
    message,
    assginedToUserId,
    req.userId,
    taskId
  );

  // History-Manage
  const historyMessage = "Task's assignee was added";
  const historyData = { oldValue: null, newValue: member.user?.email };
  await prisma.history.createHistory(
    req.userId,
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
  const findMember = await prisma.taskAssignUsers.findFirstOrThrow({
    where: {
      taskAssignUsersId: taskAssignUsersId,
    },
    include: {
      user: {
        select: {
          email: true
        },
      },
    },
  });
  const action = await prisma.task.canEditOrDelete(
    findMember.taskId,
    req.userId
  );
  if (!action) {
    throw new UnAuthorizedError();
  }
  await prisma.taskAssignUsers.delete({
    where: {
      taskAssignUsersId: taskAssignUsersId,
    },
  });

  // History-Manage
  const historyMessage = "Task's assignee was removed";
  const historyData = { oldValue: findMember.user?.email, newValue: null };
  await prisma.history.createHistory(
    req.userId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    findMember.taskId
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
  if (!req.userId) {
    throw new BadRequestError("userId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  const action = await prisma.task.canCreate(taskId, req.userId);
  if (!action) {
    throw new UnAuthorizedError();
  }
  const { dependentType, dependendentOnTaskId } = dependenciesTaskSchema.parse(
    req.body
  );
  const findDependencies = await prisma.taskDependencies.findFirst({
    where: {
      dependendentOnTaskId,
      dependentTaskId: taskId,
    },
  });
  if (findDependencies) {
    throw new BadRequestError("Already have dependencies on this task!!");
  }
  const addDependencies = await prisma.taskDependencies.create({
    data: {
      dependentType: dependentType,
      dependentTaskId: taskId,
      dependendentOnTaskId: dependendentOnTaskId,
      dependenciesAddedBy: req.userId
    },
    include: {
      dependentOnTask: {
        select: {
          taskName: true,
        }
      }
    }
  });

  // History-Manage
  const historyMessage = "Task’s dependency was added";
  const historyData = { oldValue: null, newValue: addDependencies.dependentOnTask.taskName };
  await prisma.history.createHistory(
    req.userId,
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
  const action = await prisma.taskDependencies.canDelete(
    taskDependenciesId,
    req.userId
  );
  if (!action) {
    throw new UnAuthorizedError();
  }
  const deletedTask = await prisma.taskDependencies.delete({
    where: {
      taskDependenciesId: taskDependenciesId,
    },
    include: {
      dependentOnTask: {
        select: {
          taskName: true,
        }
      }
    }
  });

  // History-Manage
  const historyMessage = "Task’s dependency was removed";
  const historyData = { oldValue: deletedTask.dependentOnTask.taskName, newValue: null };
  await prisma.history.createHistory(
    req.userId,
    HistoryTypeEnumValue.TASK,
    historyMessage,
    historyData,
    deletedTask.dependentTaskId
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
  if (!req.organisationId) {
    throw new BadRequestError("organisationId not found!!");
  }
  const taskId = uuidSchema.parse(req.params.taskId);
  const prisma = await getClientByTenantId(req.tenantId);
  const action = await prisma.task.canEditOrDelete(taskId, req.userId);
  if (!action) {
    throw new UnAuthorizedError();
  }
  const { milestoneIndicator } = milestoneTaskSchema.parse(req.body);
  const duration = 1; // If milestone then duration will be 1 : 23-02-2024 - dev_hitesh
  const milestone = await prisma.task.update({
    data: {
      milestoneIndicator: milestoneIndicator,
      duration,
      completionPecentage: 0 // If milestone then percentage will be 0 : 05-03-2024 - dev_hitesh
    },
    where: {
      taskId: taskId,
    },
    include: { parent: { select: { taskId: true }}}
  });

  // Handle-auto-duration
  if (milestone && milestone.parent?.taskId) {
      const updatedParent = await prisma.task.findFirst({
        where: {
          taskId: milestone.parent.taskId
        },
        include: { subtasks: true }
      })
      const subtaskDurations =
      updatedParent?.subtasks.map((subtask) => subtask.duration) ?? [];
      const maxSubtaskDuration = Math.max(...subtaskDurations);
      await prisma.task.update({
        where: {
          taskId: milestone.parent.taskId,
        },
        data: {
          duration: maxSubtaskDuration,
        },
      });
  }

  // History-Manage
  const milestoneMessage = milestoneIndicator ? "converted" : "reverted";
  const historyMessage = `Task was ${milestoneMessage} as a milestone`;
  const isMilestone = milestoneIndicator;
  const historyData = {
    oldValue: isMilestone ? null : "true",
    newValue: isMilestone ? "true" : "false",
  };
  await prisma.history.createHistory(
    req.userId,
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
