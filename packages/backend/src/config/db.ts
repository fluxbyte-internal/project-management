import { PrismaClient } from "@prisma/client";
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
    model: {
      task: {
        endDate(startDate: Date | string, durationDays: number): Date {
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + durationDays);
          return endDate;
        },
        taskFlagTPICalculation(
          actualProgress: number,
          taskDuration: number,
          durationSpentToDate: number,
          isMilestone: boolean
        ): "Red" | "Orange" | "Green" {
          const plannedProgress = durationSpentToDate / taskDuration;
          const tpi = actualProgress / plannedProgress;
          if (isMilestone) {
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
        async calculateSubTask(startingTaskId: string, tanentId: string) {
          let currentTaskId: string | null = startingTaskId;
          let count = 0;
          const prisma = await getClientByTenantId(tanentId);
          while (currentTaskId) {
            const currentTask = (await prisma.task.findFirst({
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
