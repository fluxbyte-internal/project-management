import { getClientByTenantId } from "../config/db.js";

export const calculateEndDateFromStartDateAndDuration = async (
  startDate: Date,
  duration: number,
  tenantId: string,
  organisationId: string
): Promise<Date> => {
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
    orgDetails?.orgHolidays.map((holiday) =>
      new Date(holiday.holidayStartDate).setUTCHours(0, 0, 0, 0)
    ) ?? []
  );

  const startDateObj = new Date(startDate);
  let endDate = new Date(startDateObj);
  endDate.setUTCHours(0, 0, 0, 0);

  let remainingDuration = duration;

  while (remainingDuration > 0) {
    endDate.setDate(endDate.getDate() + 1);

    const dayOfWeek = endDate.getUTCDay();
    const dayAbbreviation = getDayAbbreviation(dayOfWeek).toUpperCase();

    if (
      !nonWorkingDaysSet.has(dayAbbreviation) &&
      !holidaysSet.has(endDate.getTime())
    ) {
      remainingDuration--;
    }
  }
  return endDate;
};

const getDayAbbreviation = (dayOfWeek: number): string => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[dayOfWeek] ?? "0";
};
