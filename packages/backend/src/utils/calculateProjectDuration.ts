import { BadRequestError } from "../config/apiError.js";
import { getClientByTenantId } from "../config/db.js";

export const calculateProjectDuration = async (
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

  if (!orgDetails) {
    throw new BadRequestError("Organization details not found");
  }

  const nonWorkingDays = (orgDetails.nonWorkingDays as string[]) ?? [];
  const holidays = orgDetails.orgHolidays ?? [];

  let currentDate = new Date(startDate);
  currentDate.setUTCHours(0, 0, 0, 0);
  const endDateUpdated = new Date(endDate);
  endDateUpdated.setUTCHours(0, 0, 0, 0);

  let duration = 0;

  while (currentDate <= endDateUpdated) {
    const dayOfWeek = currentDate.getDay();
    const dayAbbreviation = getDayAbbreviation(dayOfWeek);

    if (
      !nonWorkingDays.includes(dayAbbreviation) &&
      !isHoliday(currentDate, holidays)
    ) {
      duration++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return duration;
};

const getDayAbbreviation = (dayOfWeek: number): string => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[dayOfWeek] ?? "0";
};

const isHoliday = (date: Date, holidays: any[]): boolean => {
  const holidayDates = holidays.map((holiday) =>
    new Date(holiday.holidayStartDate).toDateString()
  );
  return holidayDates.includes(date.toDateString());
};
