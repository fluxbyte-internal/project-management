import { getClientByTenantId } from "../config/db.js";
import { taskEndDate } from "./calcualteTaskEndDate.js";

export async function calculationSPI(
  tenantId: string,
  organisationId: string,
  projectId: string
) {
  const prisma = await getClientByTenantId(tenantId);
  const findTask = await prisma.task.findMany({
    where: { projectId, deletedAt: null, parentTaskId: null },
  });

  let sumOfTotalActualProgressionAndDuration = 0;
  let totalPlannedProgression = 0;
  for (const task of findTask) {
    const taskStartDate = new Date(task.startDate);
    const currentDate = new Date() < taskStartDate ? taskStartDate : new Date(); // Use task end date if currentDate is greater

    const completionPercentage = task.completionPecentage || 0;
    const sumOfDurationAndProgression = completionPercentage * task.duration;
    sumOfTotalActualProgressionAndDuration += sumOfDurationAndProgression;

    let startDate = new Date(task.startDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = await taskEndDate(task, tenantId, organisationId);
    let effectiveDate =
      currentDate > new Date(endDate) ? new Date(endDate) : currentDate;
    effectiveDate.setUTCHours(0, 0, 0, 0);

    const daysElapsed =
      Math.max(
        0,
        (effectiveDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    const plannedProgression = (daysElapsed / task.duration) * 100;
    totalPlannedProgression += plannedProgression;
  }
  const finalValue =
    Math.round(sumOfTotalActualProgressionAndDuration) /
    Math.round(totalPlannedProgression);
  return finalValue;
}
