import { Task } from "@prisma/client";

export class TaskService {
  static calculateSubTask(tasksData: Task[], taskId: string): number {
    let count = 0;
    for (const task of tasksData) {
      if (task.parentTaskId === taskId) {
        count += 1 + TaskService.calculateSubTask(tasksData, task.taskId);
      }
    }
    return count;
  };

  static finalSubTaskCount(data: Task[]): number {
    let taskCounts: number = 0;
    for (const task of data) {
      const subtaskCount = TaskService.calculateSubTask(data, task.taskId);
      taskCounts = subtaskCount + 1; // Add 1 for the root task
    };
    return taskCounts;
  }

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
};