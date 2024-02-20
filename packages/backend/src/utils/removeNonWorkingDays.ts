import { getClientByTenantId } from "../config/db.js";

export async function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  tenantId: string,
  organisationId: string
) {
  const prisma = await getClientByTenantId(tenantId);
  const orgDetails = await prisma.organisation.findFirst({
    where: {
      organisationId,
    },
    select: {
      nonWorkingDays: true,
      orgHolidays: true,
    },
  });
  const nonWorkingDays = orgDetails?.nonWorkingDays as string[];
  const holidays = orgDetails?.orgHolidays ?? [];

  function isNonWorkingDay(date: any) {
    const dayOfWeek = date
    .toLocaleString("en-US", { weekday: "short" })
    .toUpperCase();
    const currentDateStr = date.toISOString().split("T")[0];
    return nonWorkingDays.includes(dayOfWeek) || holidays.some(holiday => {
      const holidayStartDateStr = new Date(holiday.holidayStartDate).toISOString().split("T")[0];
      return currentDateStr === holidayStartDateStr;
    });
  }

  let currentDate = new Date(startDate);
  let workingDays = 0;

  while (currentDate <= endDate) {
    if (!isNonWorkingDay(currentDate)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
}
