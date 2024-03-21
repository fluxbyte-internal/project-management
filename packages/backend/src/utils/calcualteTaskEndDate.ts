import { Task } from "@prisma/client";
import { getClientByTenantId } from "../config/db.js";
import { getDayAbbreviation } from "./getDatAbbreviation.js";
import { isHoliday } from "./checkIsHoliday.js";

export async function taskEndDate(
  task: Task,
  tenantId: string,
  organisationId: string
): Promise<string> {
  let endDate: Date = new Date();
  if (
    task &&
    task.startDate &&
    task.duration !== null &&
    task.duration !== undefined
  ) {
    endDate = await calculateEndDate(
      task.startDate,
      task.duration,
      tenantId,
      organisationId
    );
    // @ts-ignore
    if (task && task.subtasks) {
      // @ts-ignore
      if (task.subtasks && task.subtasks.length > 0) {
        let parentEndDate = endDate;
        // @ts-ignore
        for (const subtask of task.subtasks) {
          if (subtask.startDate && subtask.duration) {
            const subtaskEndDate = await calculateEndDate(
              subtask.startDate,
              subtask.duration,
              tenantId,
              organisationId
            );
            if (subtaskEndDate > parentEndDate) {
              parentEndDate = subtaskEndDate;
            }
          }
        }
        if (parentEndDate > endDate) {
          endDate = parentEndDate;
        }
      }

      endDate.setUTCHours(0, 0, 0, 0);
      return endDate.toISOString();
    }
  }
  endDate.setUTCHours(0, 0, 0, 0);
  return endDate.toISOString();
}

export const calculateEndDate = async (
  startDate: Date,
  duration: number,
  tenantId: string,
  organisationId: string
): Promise<Date> => {
  const prisma = await getClientByTenantId(tenantId);
  const orgDetails = await prisma.organisation.findFirst({
    where: {
      organisationId,
      deletedAt: null
    },
    select: {
      nonWorkingDays: true,
      orgHolidays: true,
    },
  });
  const nonWorkingDays = (orgDetails?.nonWorkingDays as string[]) ?? [];
  const holidays = orgDetails?.orgHolidays ?? [];
  const startDateObj = new Date(startDate);
  let endDate = new Date(startDateObj);
  endDate.setUTCHours(0, 0, 0, 0);
  let remainingDuration = duration;

  const startDayOfWeek = endDate.getUTCDay();
  const startDayAbbreviation = getDayAbbreviation(startDayOfWeek).toUpperCase();
  if (!nonWorkingDays.includes(startDayAbbreviation) && !isHoliday(endDate, holidays)) {
    remainingDuration--;
  }

  while (remainingDuration > 0) {
    endDate.setDate(endDate.getDate() + 1);
    const dayOfWeek = endDate.getUTCDay();
    const dayAbbreviation = getDayAbbreviation(dayOfWeek).toUpperCase();
    if (!nonWorkingDays.includes(dayAbbreviation) && !isHoliday(endDate, holidays)) {
      remainingDuration--;
    }
  }
  return endDate;
};

export const calculateDuration = async (
  startDate: Date,
  endDate: Date,
  tenantId: string,
  organisationId: string
): Promise<number> => {
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


  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setUTCHours(0, 0, 0, 0)
  end.setUTCHours(0, 0, 0, 0)
  let duration = 0;

  while (start <= end) {
    const dayOfWeek = start.getUTCDay();
    const dayAbbreviation = getDayAbbreviation(dayOfWeek).toUpperCase();

    if (
      !nonWorkingDays.includes(dayAbbreviation) &&
      !isHoliday(start, holidays)
    ) {
      duration++;
    }

    start.setDate(start.getDate() + 1);
  }
  return duration;
};
