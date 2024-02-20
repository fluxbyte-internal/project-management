import { Task } from "@prisma/client";
import { getClientByTenantId } from "../config/db.js";
import { settings } from "../config/settings.js";
import { calculateWorkingDays } from "./removeNonWorkingDays.js";

export async function calculationSubTaskProgression(
  task: Task & { subtasks: Task[] },
  tenantId: string,
  organisationId: string
) {
  if (task.subtasks && task.subtasks.length > 0) {
    let completionPecentageOrDurationTask = 0;
    let averagesSumOfDurationTask = 0;
    const prisma = await getClientByTenantId(tenantId);
    for (const value of task.subtasks) {
      const taskEndDate = prisma.task.calculateEndDate(
        value.startDate,
        value.duration
      );
      const duration = await calculateWorkingDays(
        task.startDate,
        taskEndDate,
        tenantId,
        organisationId
      );
      const percentage = await calculationSubTaskProgression(
        value as Task & { subtasks: Task[] },
        tenantId,
        organisationId
      );
      completionPecentageOrDurationTask +=
        Number(percentage) * (duration * settings.hours);
      averagesSumOfDurationTask += duration * settings.hours * 100;
    }
    return (
      (completionPecentageOrDurationTask / averagesSumOfDurationTask) * 100
    );
  } else {
    return task.completionPecentage;
  }
}
