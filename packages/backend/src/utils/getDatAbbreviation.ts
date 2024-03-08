export const getDayAbbreviation = (dayOfWeek: number): string => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[dayOfWeek] ?? "0";
};
