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
    return (
      nonWorkingDays.includes(dayOfWeek) ||
      holidays.includes(date.toISOString().split("T")[0])
    );
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
