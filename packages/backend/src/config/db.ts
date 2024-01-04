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
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);
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
              completionPecentage = "100";
            }
            const tpi = parseInt(completionPecentage) / plannedProgress;
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
