import { NotificationTypeEnum, PrismaClient, Task, UserStatusEnum, UserRoleEnum, HistoryTypeEnum } from "@prisma/client";
import { RegisterSocketServices } from "../services/socket.services.js";
import { settings } from "./settings.js";

const rootPrismaClient = generatePrismaClient();
const prismaClients: Record<
  "root" | (Omit<string, "root"> & string),
  typeof rootPrismaClient
> = {
  root: rootPrismaClient,
};
function generatePrismaClient(datasourceUrl?: string) {
  let prismaClientParams: ConstructorParameters<typeof PrismaClient> = [];
  if (typeof datasourceUrl === "string") {
    prismaClientParams = [
      {
        datasourceUrl,
      },
    ];
  }
  const client = new PrismaClient(...prismaClientParams).$extends({
    result: {
      task: {
      },
    },
    model: {
      notification: {
        async sendNotification(
          notificationType: NotificationTypeEnum,
          details: string,
          sentTo: string,
          sentBy: string,
          referenceId: string
        ) {
          const responseNotification = await client.notification.create({
            data: {
              type: notificationType,
              details: details,
              sentTo: sentTo,
              sentBy: sentBy,
              referenceId: referenceId,
            },
          });
          RegisterSocketServices.io
            .in(responseNotification.sentTo)
            .emit("notification", responseNotification);
          return responseNotification;
        },
      },
      history: {
        async createHistory(
          userId: string,
          historyType: HistoryTypeEnum,
          historyMesage: string,
          historyData: { oldValue?: string; newValue?: string } | any,
          historyRefrenceId: string
        ) {
          const history = await client.history.create({
            data: {
              type: historyType,
              data: historyData,
              createdBy: userId,
              referenceId: historyRefrenceId,
              message: historyMesage,
            },
          });
          return history;
        },
      },
      userOrganisation: {
        async findAdministrator(organisationId: string) {
          return await client.userOrganisation.findMany({
            where: {
              organisationId,
              role: UserRoleEnum.ADMINISTRATOR,
              user: {
                status: UserStatusEnum.ACTIVE,
              },
              deletedAt: null,
            },
          });
        },
      },
      project: {
        async projectProgression(projectId: string, tenantId: string, organisationId: string) {
          const parentTasks = await client.task.findMany({
            where: {
              projectId,
              deletedAt: null,
              parentTaskId: null,
            },
          });

          let completionPecentageOrDuration = 0;
          let averagesSumOfDuration = 0;

          for (const value of parentTasks) {
            completionPecentageOrDuration +=
              Number(value.completionPecentage) * (value.duration * settings.hours);
            averagesSumOfDuration += value.duration * settings.hours * 100;
          }
          return (completionPecentageOrDuration / averagesSumOfDuration);
        },
      },
      task: {
        // create action (comment-attachment-dependencies)
        async canCreate(taskId: string, userId: string) {
          const task = await client.task.getTaskById(taskId);
          const userRoles = await client.user.getUserRoles(userId);
          const allowedRoles: UserRoleEnum[] = [
            UserRoleEnum.ADMINISTRATOR,
            UserRoleEnum.PROJECT_MANAGER,
          ];

          const isAssignedToTask = task.assignedUsers.some(
            (assignedUser) => assignedUser.user.userId === userId
          );
          return (
            userId === task.createdByUserId ||
            userRoles.some((role) => allowedRoles.includes(role)) ||
            isAssignedToTask
          );
        },
        async canEditOrDelete(taskId: string, userId: string) {
          const task = await client.task.getTaskById(taskId);
          const userRoles = await client.user.getUserRoles(userId);

          const allowedRoles: UserRoleEnum[] = [
            UserRoleEnum.ADMINISTRATOR,
            UserRoleEnum.PROJECT_MANAGER,
          ];
          const isTaskAuthor = task.createdByUserId === userId;
          const canPerformAction =
            userRoles.some((role) => allowedRoles.includes(role)) ||
            isTaskAuthor;

          return canPerformAction;
        },
        async getTaskById(taskId: string) {
          return client.task.findFirstOrThrow({
            where: { taskId, deletedAt: null },
            include: {
              assignedUsers: {
                where: { deletedAt: null },
                include: {
                  user: true,
                },
              },
            },
          });
        },
        async calculateSubTask(startingTaskId: string) {
          let currentTaskId: string | null = startingTaskId;
          let count = 0;
          while (currentTaskId) {
            const currentTask = (await client.task.findFirst({
              where: { taskId: currentTaskId, deletedAt: null },
              select: { parentTaskId: true },
            })) as { taskId: string; parentTaskId: string | null };
            if (currentTask) {
              count += 1;
              currentTaskId = currentTask.parentTaskId;
            } else {
              break;
            }
          }
          return count;
        },
        calculateEndDate(startDate: Date, duration: number) {
          const startDateObj = new Date(startDate);
          const endDate = new Date(startDateObj);

          const integerPart = Math.floor(duration);
          endDate.setDate(startDateObj.getDate() + integerPart);

          const fractionalPartInHours = (duration % 1) * 24;
          endDate.setHours(startDateObj.getHours() + fractionalPartInHours);

          return endDate;
        },
        async getSubtasksTimeline(taskId: string) {
          const task = await client.task.findFirst({
            where: { taskId, deletedAt: null, parentTaskId: null },
            include: {
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
            },
            orderBy: { startDate: "asc" },
          });
          if (!task) {
            return { earliestStartDate: null, lowestEndDate: null };
          }
          const startDateObj = new Date(task.startDate);
          let lowestEndDate: Date = startDateObj;
          if (task.duration) {
            lowestEndDate.setDate(startDateObj.getDate() + task.duration);
          }
          let earliestStartDate: Date | null = null;
          if (task.subtasks.length > 0) {
            task.subtasks.forEach((subtask) => {
              if (!earliestStartDate) {
                earliestStartDate = subtask.startDate;
              } else if (
                earliestStartDate &&
                subtask.startDate < earliestStartDate
              ) {
                earliestStartDate = subtask.startDate;
              }
            });
          }
          return { earliestStartDate, lowestEndDate };
        },
      },
      comments: {
        async canEditOrDelete(commentId: string, userId: string) {
          const comment = await client.comments.findFirstOrThrow({
            where: { commentId, deletedAt: null },
            include: {
              commentByUser: true,
            },
          });
          const userRoles = await client.user.getUserRoles(userId);

          const allowedRoles: UserRoleEnum[] = [
            UserRoleEnum.ADMINISTRATOR,
            UserRoleEnum.PROJECT_MANAGER,
          ];

          const isCommentAuthor = comment.commentByUser.userId === userId;
          const canPerformAction =
            userRoles.some((role) => allowedRoles.includes(role)) ||
            isCommentAuthor;

          return canPerformAction;
        },
      },
      taskAttachment: {
        async canDelete(attachmentId: string, userId: string) {
          const attachment = await client.taskAttachment.findFirstOrThrow({
            where: { attachmentId: attachmentId, deletedAt: null },
            include: {
              task: {
                include: {
                  assignedUsers: {
                    where: { deletedAt: null },
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          });

          const userRoles = await client.user.getUserRoles(userId);
          const allowedRoles: UserRoleEnum[] = [
            UserRoleEnum.ADMINISTRATOR,
            UserRoleEnum.PROJECT_MANAGER,
          ];
          const isAttachmentAuthor = attachment.uploadedBy === userId;
          const canPerformAction =
            userRoles.some((role) => allowedRoles.includes(role)) ||
            isAttachmentAuthor;

          return canPerformAction;
        },
      },
      taskDependencies: {
        async canDelete(taskDependenciesId: string, userId: string) {
          const dependencies = await client.taskDependencies.findFirstOrThrow({
            where: {
              taskDependenciesId: taskDependenciesId,
              deletedAt: null,
            },
          });

          const userRoles = await client.user.getUserRoles(userId);
          const allowedRoles: UserRoleEnum[] = [
            UserRoleEnum.ADMINISTRATOR,
            UserRoleEnum.PROJECT_MANAGER,
          ];

          const isAdminOrProjectManager = userRoles.some((role) =>
            allowedRoles.includes(role)
          );

          const isDependenciesAuthor =
            dependencies.dependenciesAddedBy === userId;
          const canPerformAction =
            userRoles.some((role) => allowedRoles.includes(role)) ||
            isDependenciesAuthor;

          return canPerformAction;
        },
      },
      user: {
        async getUserRoles(userId: string) {
          const user = await client.user.findFirstOrThrow({
            include: {
              userOrganisation: {
                where: { deletedAt: null },
                select: {
                  role: true,
                },
              },
            },
            where: {
              userId: userId,
              deletedAt: null,
            },
          });
          return user.userOrganisation.map((org) => org.role);
        },
      },
    },
  });
  return client;
}

export async function getClientByTenantId(
  tenantId: string
): Promise<ReturnType<typeof generatePrismaClient>> {
  if (!tenantId) {
    return prismaClients.root;
  }
  const findTenant = await prismaClients.root?.tenant.findUnique({
    where: { tenantId: tenantId },
  });
  if (!findTenant) {
    return prismaClients.root;
  }
  prismaClients[tenantId] = generatePrismaClient(findTenant.connectionString!);
  return prismaClients[tenantId] as ReturnType<typeof generatePrismaClient>;
}
