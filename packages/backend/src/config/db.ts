import { HistoryTypeEnum, PrismaClient, Task } from "@prisma/client";
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
          needs: { startDate: true, duration: true },
          compute(task) {
            const { startDate, duration } = task;
            const startDateObj = new Date(startDate);
            const endDate = startDateObj;

            const integerPart = Math.floor(duration);
            endDate.setDate(startDateObj.getDate() + integerPart); // Duration as days
            
            const fractionalPartInHours = (duration % 1) * 24; // Duration as hours
            endDate.setHours(startDateObj.getHours() + fractionalPartInHours);

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
      project: {
        async projectProgression(projectId: string) {
          const hours: number = 24;
          const parentTasks = await client.task.findMany({
            where: {
              projectId,
              parentTaskId: null,
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
        async calculationSubTaskProgression(taskId: string) {
          const hours: number = 24;
          const parentTask = await client.task.findFirst({
            where: { taskId },
            include: {
              subtasks: true,
            },
          });
          if (
            parentTask &&
            !parentTask.parentTaskId &&
            (parentTask?.subtasks).length > 0
          ) {
            let completionPecentageOrDurationTask = 0;
            let averagesSumOfDurationTask = 0;
            for (const value of parentTask.subtasks) {
              completionPecentageOrDurationTask +=
                Number(value.completionPecentage) * (value.duration * hours);
            }
            for (const secondValue of parentTask.subtasks) {
              averagesSumOfDurationTask += secondValue.duration * hours * 100;
            }
            return (
              completionPecentageOrDurationTask / averagesSumOfDurationTask
            );
          } else return Number(parentTask?.completionPecentage);
        },
        async calculateSubTask(startingTaskId: string) {
          let currentTaskId: string | null = startingTaskId;
          let count = 0;
          while (currentTaskId) {
            const currentTask = (await client.task.findFirst({
              where: { taskId: currentTaskId },
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
