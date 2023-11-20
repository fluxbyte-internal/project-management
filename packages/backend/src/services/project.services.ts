export class ProjectService {
  static calculateActualEndDate(date1: Date | null, date2: Date): Date {
    if (date1 === null) return new Date();
    return new Date(date1) > new Date(date2) ? new Date(date1) : new Date(date2);
  };
};