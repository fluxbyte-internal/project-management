import { getClientByTenantId } from "../config/db.js";

export class TaskService {
  static taskFlagTPICalculation(actualProgress: number, taskDuration: number, durationSpentToDate: number): string {
    const plannedProgress = durationSpentToDate / taskDuration;
    const tpi = actualProgress / plannedProgress;

    if (tpi < 0.8) {
      return 'Red';
    } else if (tpi >= 0.8 && tpi < 0.95) {
      return 'Orange';
    } else {
      return 'Green';
    }
  };

  static calculateTaskEndDate(startDate: Date | string, durationDays: number): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return endDate;
  };

  static async calculateSubTask(startingTaskId: string, tanentId: string) {
    let currentTaskId: string | null = startingTaskId;
    let count = 0;
    const prisma = await getClientByTenantId(tanentId);
    const parentTasks = await prisma.task.findMany();
    while (currentTaskId) {
      const currentTask = parentTasks.find(task => task.taskId === currentTaskId);
      if (currentTask) {
        count += 1;
        currentTaskId = currentTask.parentTaskId;
      } else { break }
    }
    return count;
  };
};