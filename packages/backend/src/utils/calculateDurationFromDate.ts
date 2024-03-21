import { getClientByTenantId } from "../config/db.js";
import { getDayAbbreviation } from "./getDatAbbreviation.js";

export const calculateDurationFromDates = async (
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
  const nonWorkingDaysSet = new Set(
    (orgDetails?.nonWorkingDays as string[]) ?? []
  );
  const holidaysSet = new Set(
    orgDetails?.orgHolidays?.map((holiday) =>
      new Date(holiday.holidayStartDate).setUTCHours(0, 0, 0, 0)
    ) ?? []
  );

  const start = new Date(startDate);
  const end = new Date(endDate);
  const utcStart = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  );
  const utcEnd = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
  );
  let duration = 0;

  while (utcStart < utcEnd) {
    const dayOfWeek = utcStart.getUTCDay();
    const dayAbbreviation = getDayAbbreviation(dayOfWeek).toUpperCase();

    if (
      !nonWorkingDaysSet.has(dayAbbreviation) &&
      !holidaysSet.has(utcStart.getTime())
    ) {
      duration++;
    }

    utcStart.setUTCDate(utcStart.getUTCDate() + 1);
  }
  return duration;
};
