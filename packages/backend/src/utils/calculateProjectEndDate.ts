import { getClientByTenantId } from "../config/db.js";
import { taskEndDate } from "./calcualteTaskEndDate.js";

export const calculateProjectEndDate = async (
  projectId: string,
  tenantId: string,
  organisationId: string
): Promise<Date | null> => {
  const prisma = await getClientByTenantId(tenantId);
  const tasks = await prisma.task.findMany({
    where: { projectId: projectId, deletedAt: null },
  });
  let maxEndDate: Date | null = null;

  await Promise.all(tasks.map(async (task) => {
    if (task.startDate && task.duration) {
      const endDate = await taskEndDate(task, tenantId, organisationId);
      if (!maxEndDate || new Date(endDate) > maxEndDate) {
        maxEndDate = new Date(endDate);
      }
    }
  }));
  return maxEndDate;
};
