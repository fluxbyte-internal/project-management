import { getClientByTenantId } from "../config/db.js";
import { taskEndDate } from "./calcualteTaskEndDate.js";
import { calculationSubTaskProgression } from "./calculationSubTaskProgression.js";
import { isHoliday } from "./checkIsHoliday.js";
import { getDayAbbreviation } from "./getDatAbbreviation.js";

export async function calculationSPI(
  tenantId: string,
  organisationId: string,
  projectId: string
) {
  const prisma = await getClientByTenantId(tenantId);
  const findTask = await prisma.task.findMany({
    where: { projectId, deletedAt: null, parentTaskId: null },
    include: {
      subtasks: {
        where: { deletedAt: null },
        include: {
          subtasks: {
            where: { deletedAt: null },
            include: {
              subtasks: true,
            },
          },
        },
      },
    },
  });
  const findOrg = await prisma.organisation.findFirst({
    where: {
      organisationId: organisationId,
    },
    select: {
      nonWorkingDays: true,
      orgHolidays: true,
    },
  });
  const nonWorkingDays = (findOrg?.nonWorkingDays as string[]) ?? [];
  const holidays = findOrg?.orgHolidays ?? [];

  let sumOfTotalActualProgressionAndDuration = 0;
  let totalPlannedProgression = 0;
  for (const task of findTask) {
    const taskStartDate = new Date(task.startDate);
    const currentDate = new Date() < taskStartDate ? taskStartDate : new Date(); // Use task end date if currentDate is greater

    const completionPercentage =
      Math.round(
        Number(
          await calculationSubTaskProgression(task, tenantId, organisationId)
        )
      ) ?? 0;
    const sumOfDurationAndProgression = completionPercentage * task.duration;
    sumOfTotalActualProgressionAndDuration += sumOfDurationAndProgression;

    let startDate = new Date(task.startDate);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = await taskEndDate(task, tenantId, organisationId);
    let effectiveDate =
      currentDate > new Date(endDate) ? new Date(endDate) : currentDate;
    effectiveDate.setUTCHours(0, 0, 0, 0);

    let dayOfStartDate = startDate.getDate();
    let dayOfEffectiveDate = effectiveDate.getDate();

    let currentDay = new Date(startDate);
    let nonWorkingDaysCount = 0;

    while (currentDay <= effectiveDate) {
      const dayOfWeek = currentDay.getDay();
      const dayAbbreviation = getDayAbbreviation(dayOfWeek).toUpperCase();
      if (nonWorkingDays.includes(dayAbbreviation)) {
        const isNonWorkingDay = !isHoliday(currentDay, holidays);
        const isHolidayCounted =
          nonWorkingDays.includes(dayAbbreviation) && isNonWorkingDay;
        if (isNonWorkingDay || isHolidayCounted) {
          nonWorkingDaysCount++;
        }
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }

    const dayDiffNew =
      dayOfEffectiveDate - dayOfStartDate - nonWorkingDaysCount + 1;

    const plannedProgression = dayDiffNew / task.duration;
    const finalPlannedProgression = plannedProgression * 100 * task.duration; //completionPercentage
    totalPlannedProgression += finalPlannedProgression;
  }
  const finalValue =
    sumOfTotalActualProgressionAndDuration / totalPlannedProgression;
  return finalValue;
}
