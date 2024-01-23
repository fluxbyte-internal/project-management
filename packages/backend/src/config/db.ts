import { NotificationTypeEnum, PrismaClient, Task } from "@prisma/client";
import { RegisterSocketServices } from "../services/socket.services.js";
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
