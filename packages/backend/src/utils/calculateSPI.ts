import { Task } from "@prisma/client";
import { calculateWorkingDays } from "./removeNonWorkingDays.js";
import { getClientByTenantId } from "../config/db.js";
import { settings } from "../config/settings.js";

export async function calculationSPI(
  tasks: Task,
  tenantId: string,
  organisationId: string
) {
  const prisma = await getClientByTenantId(tenantId);
  const actualProgression = tasks.completionPecentage ?? 0;
  const plannedProgression = await prisma.task.calculateTaskPlannedProgression(
    tasks,
    tenantId,
    organisationId
  );
  const taskEndDate = prisma.task.calculateEndDate(
    tasks.startDate,
    tasks.duration
  );
  const newDuration = await calculateWorkingDays(
    tasks.startDate,
    taskEndDate,
    tenantId,
    organisationId
  );
  const value =
    (actualProgression * (newDuration * settings.hours)) /
    (plannedProgression * (newDuration * settings.hours));
  return value;
}
