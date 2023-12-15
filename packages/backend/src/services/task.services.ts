import { getClientByTenantId } from "../config/db.js";

export class TaskService {
  static async calculateSubTask(startingTaskId: string, tanentId: string) {
    let currentTaskId: string | null = startingTaskId;
    let count = 0;
    const prisma = await getClientByTenantId(tanentId);
    while (currentTaskId) {
      const currentTask = (await prisma.task.findFirst({
        where: { taskId: currentTaskId },
      })) as { taskId: string; parentTaskId: string | null };
      if (currentTask) {
        count += 1;
        currentTaskId = currentTask.parentTaskId;
      } else {
        break;
      }
    }
    return count;
  }
}
