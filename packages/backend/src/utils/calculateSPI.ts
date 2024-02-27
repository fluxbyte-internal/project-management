import { Task } from "@prisma/client";
import { settings } from "../config/settings.js";
import { excludeNonWorkingDays } from "./calculationFlag.js";

export async function calculationSPI(
  tasks: Task,
  tenantId: string,
  organisationId: string
) {
  const actualProgression = tasks.completionPecentage ?? 0;
  const taskStartDate = new Date(tasks.startDate);
  const currentDate = new Date() < taskStartDate ? taskStartDate : new Date(); // Use task end date if currentDate is greater
  currentDate.setUTCHours(0, 0, 0, 0);
  taskStartDate.setUTCHours(0, 0, 0, 0);
  const remainingDuration = await excludeNonWorkingDays(
    currentDate,
    taskStartDate,
    tenantId,
    organisationId
  );
  const plannedProgress = (remainingDuration + 1) / tasks.duration;
  const value =
    (actualProgression * (tasks.duration * settings.hours)) /
    (plannedProgress * (tasks.duration * settings.hours));
  return value;
}
