import { NotificationTypeEnum, PrismaClient, Task } from "@prisma/client";
import { RegisterSocketServices } from "../services/socket.services.js";
import {
  HistoryTypeEnum,
  UserRoleEnum,
  UserStatusEnum,
} from "@prisma/client";

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
        endDate: {
          compute(task) {
            let endDate: Date = new Date();
            if (
              task &&
              task.startDate &&
              task.duration !== null &&
              task.duration !== undefined
            ) {
              endDate = client.task.calculateEndDate(
                task.startDate,
                task.duration
              );
            }
            // @ts-ignore
            if (task && task.subtasks) {
              // @ts-ignore
              task.subtasks.forEach((subtask) => {
                if (
                  subtask.endDate &&
                  (!endDate || subtask.endDate > endDate)
                ) {
                  endDate = new Date(subtask.endDate);
                } else if (
                  subtask.dueDate &&
                  (!endDate || subtask.dueDate > endDate)
                ) {
                  endDate = new Date(subtask.dueDate);
                }
              });
            }
            return endDate;
          },
        },
        flag: {
          needs: { milestoneIndicator: true },
          compute(task: Task): "Red" | "Orange" | "Green" {
            let { milestoneIndicator, duration, completionPecentage } = task;

            //TODO: Need to change logic here
            const plannedProgress = duration / duration;
            if (!completionPecentage) {
              completionPecentage = 100;
            }
            const tpi = completionPecentage / plannedProgress;
            if (milestoneIndicator) {
              return tpi < 1 ? "Red" : "Green";
            } else {
              if (tpi < 0.8) {
                return "Red";
              } else if (tpi >= 0.8 && tpi < 0.95) {
                return "Orange";
              } else {
                return "Green";
              }
            }
          },
        },
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
        async projectProgression(projectId: string) {
          const hours: number = 24;
          const parentTasks = await client.task.findMany({
            where: {
              projectId,
              parentTaskId: null,
              deletedAt: null,
            },
          });

          let completionPecentageOrDuration = 0;
          let averagesSumOfDuration = 0;

          for (const value of parentTasks) {
            completionPecentageOrDuration +=
              Number(value.completionPecentage) * (value.duration * hours);
          }
          for (const secondValue of parentTasks) {
            averagesSumOfDuration += secondValue.duration * hours * 100;
          }
          return completionPecentageOrDuration / averagesSumOfDuration;
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
            where: { taskId, deletedAt: null, },
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
        calculationSubTaskProgression(
          task: (Task & { subtasks: Task[] }) | any
        ) {
          if (task.subtasks && task.subtasks.length > 0) {
            const hours: number = 24;
            let completionPecentageOrDurationTask = 0;
            let averagesSumOfDurationTask = 0;
            for (const value of task.subtasks) {
              const percentage =
                client.task.calculationSubTaskProgression(value);
              completionPecentageOrDurationTask +=
                Number(percentage) * (value.duration * hours);
              averagesSumOfDurationTask += value.duration * hours * 100;
            }
            return (
              (completionPecentageOrDurationTask / averagesSumOfDurationTask) *
              100
            );
          } else {
            return task.completionPecentage
          }
        },
        async calculateSubTask(startingTaskId: string) {
          let currentTaskId: string | null = startingTaskId;
          let count = 0;
          while (currentTaskId) {
            const currentTask = (await client.task.findFirst({
              where: { taskId: currentTaskId, deletedAt: null, },
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
        async findMaxEndDateAmongTasks(projectId: string) {
          const tasks = await client.task.findMany({
            where: { projectId: projectId, deletedAt: null, },
            select: {
              startDate: true,
              duration: true,
              dueDate: true,
              milestoneIndicator: true,
            },
          });

          let maxEndDate: Date | null = null;

          tasks.forEach((task) => {
            if (
              task.startDate &&
              task.duration !== null &&
              task.duration !== undefined
            ) {
              // Check if milestone is true and use dueDate in that case
              const endDate =
                task.milestoneIndicator && task.dueDate
                  ? new Date(task.dueDate)
                  : client.task.calculateEndDate(task.startDate, task.duration);

              if (!maxEndDate || endDate > maxEndDate) {
                maxEndDate = endDate;
              }
            }
          });
          return maxEndDate;
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
