import { Task, TaskStatusEnum } from "@prisma/client";
import { getClientByTenantId } from "../config/db.js";
import { getDayAbbreviation } from "./getDatAbbreviation.js";
import { isHoliday } from "./checkIsHoliday.js";
import { taskEndDate } from "./calcualteTaskEndDate.js";

export async function calculationTPI(
  task: Task,
  tenantId: string,
  organisationId: string
): Promise<{ tpiValue: number; tpiFlag: "Red" | "Orange" | "Green" }> {
  let { duration, completionPecentage, startDate, status } = task;
  if (status === TaskStatusEnum.NOT_STARTED) {
    return {
      tpiValue: 0,
      tpiFlag: "Green",
    };
  }

  if (!completionPecentage) {
    completionPecentage = 0;
  }
  const currentDate = new Date();
  const taskStartDate = new Date(startDate);
  const endDate = await taskEndDate(task, tenantId, organisationId);
  const effectiveDate = currentDate > new Date(endDate) ? new Date(endDate) : currentDate;
  effectiveDate.setUTCHours(0, 0, 0, 0);
  taskStartDate.setUTCHours(0, 0, 0, 0);
  const remainingDuration = await excludeNonWorkingDays(
    effectiveDate,
    taskStartDate,
    tenantId,
    organisationId
  );
  const plannedProgress = (remainingDuration / duration) * 100;
  const tpi = plannedProgress !== 0 ? completionPecentage / plannedProgress : 0;
  let flag: "Red" | "Orange" | "Green";
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
}

export async function taskFlag(
  task: Task,
  tenantId: string,
  organisationId: string
): Promise<"Red" | "Orange" | "Green"> {
  const { milestoneIndicator } = task;
  const tpi = await calculationTPI(task, tenantId, organisationId);
  if (milestoneIndicator) {
    return tpi.tpiValue < 1 ? "Red" : "Green";
  } else {
    return tpi.tpiFlag;
  }
}

export const excludeNonWorkingDays = async (
  currentDate: Date,
  startDate: Date,
  tenantId: string,
  organisationId: string
) => {
  const prisma = await getClientByTenantId(tenantId);
  const orgDetails = await prisma.organisation.findFirst({
    where: {
      organisationId,
      deletedAt: null,
    },
    select: {
      nonWorkingDays: true,
      orgHolidays: true,
    },
  });

  const nonWorkingDays = (orgDetails?.nonWorkingDays as string[]) ?? [];
  const holidays = orgDetails?.orgHolidays ?? [];
  let remainingDuration = 0;
  for (
    let date = new Date(startDate);
    date <= currentDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();
    const dayAbbreviation = getDayAbbreviation(dayOfWeek);

    // Check if it's a working day (not a holiday and not in non-working days)
    if (
      !nonWorkingDays.includes(dayAbbreviation) &&
      !isHoliday(date, holidays)
    ) {
      remainingDuration++;
    }
  }
  return remainingDuration;
};
