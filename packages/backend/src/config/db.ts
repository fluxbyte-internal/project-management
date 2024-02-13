import { NotificationTypeEnum, PrismaClient, Task, TaskStatusEnum, UserStatusEnum, UserRoleEnum, HistoryTypeEnum, Project } from "@prisma/client";
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
            let { milestoneIndicator } = task;
            const tpi = client.task.tpiCalculation(task);
            if (milestoneIndicator) {
              return tpi.tpiValue < 1 ? "Red" : "Green";
            } else {
              return tpi.tpiFlag;
            }
          },
        },
      },
    },
    model: {
      $allModels: {
        daysFromTwoDates(startDate: Date, endDate: Date): number {
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          startDateObj.setHours(0, 0, 0, 0);
          endDateObj.setHours(0, 0, 0, 0);
          const durationMilliseconds = endDateObj.getTime() - startDateObj.getTime();
          return Math.ceil(durationMilliseconds / 86400000);
        },
      },
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
          const parentTasks = await client.task.findMany({
            where: {
              projectId,
              deletedAt: null,
            },
          });

          let completionPecentageOrDuration = 0;
          let averagesSumOfDuration = 0;

          for (const value of parentTasks) {
            const duration = client.task.daysFromTwoDates(value.startDate, value.endDate);
            completionPecentageOrDuration +=
            Number(value.completionPecentage) *
            (duration * settings.hours);
            averagesSumOfDuration += duration * settings.hours * 100;
          }
          return (completionPecentageOrDuration / averagesSumOfDuration);
        },
        async calculationCPI(project: Project) {
          const progressionPercentage = await client.project.projectProgression(
            project.projectId
          );
          const estimatedBudgetNumber = parseFloat(project.estimatedBudget);
          const consumedBudgetNumber = parseFloat(project.consumedBudget);
          return (
            (progressionPercentage * estimatedBudgetNumber) /
            consumedBudgetNumber
          );
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
        calculationSubTaskProgression(
          task: (Task & { subtasks: Task[] }) | any
        ) {
          if (task.subtasks && task.subtasks.length > 0) {
            let completionPecentageOrDurationTask = 0;
            let averagesSumOfDurationTask = 0;
            for (const value of task.subtasks) {
              const duration = client.task.daysFromTwoDates(value.startDate, value.endDate);
              const percentage =
                client.task.calculationSubTaskProgression(value);
              completionPecentageOrDurationTask +=
                Number(percentage) * (duration * settings.hours);
              averagesSumOfDurationTask +=
                duration * settings.hours * 100;
            }
            return (
              (completionPecentageOrDurationTask / averagesSumOfDurationTask) *
              100
            );
          } else {
            return task.completionPecentage;
          }
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
        async findMaxEndDateAmongTasks(projectId: string) {
          const tasks = await client.task.findMany({
            where: { projectId: projectId, deletedAt: null },
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
        calculationSPI(tasks: Task): number {
          const actualProgression = tasks.completionPecentage ?? 0;
          const plannedProgression =
            client.task.calculateTaskPlannedProgression(tasks);
            const taskEndDate = client.task
            .calculateEndDate(tasks.startDate, tasks.duration)
            const newDuration = client.task.daysFromTwoDates(tasks.startDate, taskEndDate);
          return (
            (actualProgression * (newDuration * settings.hours)) /
            (plannedProgression * (newDuration * settings.hours))
          );
        },
        calculateTaskPlannedProgression(task: Task): number {
          const currentDate = new Date().getTime();
          const taskStartDate = new Date(task.startDate).getTime();
          const taskEndDate = client.task
            .calculateEndDate(task.startDate, task.duration)
          const effectiveCurrentDate = Math.min(currentDate, (taskEndDate).getTime()); // Use task end date if currentDate is greater
          const newDuration = client.task.daysFromTwoDates(task.startDate, taskEndDate);
          const plannedProgression =
            (effectiveCurrentDate - taskStartDate + 1) /
            (newDuration * settings.hours);
          return plannedProgression;
        },
        tpiCalculation(task: Task): {
          tpiValue: number;
          tpiFlag: "Red" | "Orange" | "Green";
        } {
          let { duration, completionPecentage, startDate, status } = task;
          const endDate = client.task.calculateEndDate(
            startDate,
            duration
          );
          const newDuration = client.task.daysFromTwoDates(task.startDate, endDate);

          if (
            status === TaskStatusEnum.TODO ||
            status === TaskStatusEnum.PLANNED
          ) {
            return {
              tpiValue: 0,
              tpiFlag: "Green",
            };
          }
          const currentDate: Date = new Date();
          const startDateObj: Date = new Date(startDate);
          const elapsedDays: number = Math.ceil(
            (currentDate.getTime() - startDateObj.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          const plannedProgress = elapsedDays / newDuration;
          if (!completionPecentage) {
            completionPecentage = 0;
          }
          const tpi = completionPecentage / plannedProgress;
          let flag = "" as "Red" | "Orange" | "Green";
          if (tpi < 0.8) {
            flag = "Red";
          } else if (tpi >= 0.8 && tpi < 0.95) {
            flag = "Orange";
          } else {
            flag = "Green";
          }
          return {
            tpiValue: tpi,
            tpiFlag: flag,
          };
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
