import { getClientByTenantId } from "../config/db.js";

export class ProjectService {
  static calculateActualEndDate(date1: Date | null, date2: Date): Date {
    if (date1 === null) return new Date();
    return new Date(date1) > new Date(date2) ? new Date(date1) : new Date(date2);
  };

  static async calculateProjectProgressionPercentage(projectId: string, tenantId: string) {
    const prisma = await getClientByTenantId(tenantId);
    const allTasks = await prisma.task.findMany({ where: { projectId: projectId, parentTaskId: null } });
    let sumOfTotalPercentageTaskAndDuration = 0;
    let totalDuration = 0;
    allTasks.forEach((parentTask) => {
      const duration = parentTask.duration || 0;
      sumOfTotalPercentageTaskAndDuration += Number(parentTask.completionPecentage) + parentTask?.duration
      totalDuration += duration;
    });
    return sumOfTotalPercentageTaskAndDuration / (totalDuration * 100);
  }
};