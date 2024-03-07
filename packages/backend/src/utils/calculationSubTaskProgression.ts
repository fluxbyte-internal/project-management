import { Task } from "@prisma/client";
import { settings } from "../config/settings.js";

export async function calculationSubTaskProgression(
  task: Task & { subtasks: Task[] },
  tenantId: string,
  organisationId: string
) {
  if (task.subtasks && task.subtasks.length > 0) {
    let completionPecentageOrDurationTask = 0;
    let averagesSumOfDurationTask = 0;
    for (const value of task.subtasks) {
      const percentage = await calculationSubTaskProgression(
        value as Task & { subtasks: Task[] },
        tenantId,
        organisationId
      );
      completionPecentageOrDurationTask +=
        Number(percentage) * (value.duration * settings.hours);
      averagesSumOfDurationTask += value.duration * settings.hours * 100;
    }
    const finalPercentage = completionPecentageOrDurationTask / averagesSumOfDurationTask * 100
    return (finalPercentage.toFixed(2));
  } else {
    return (task.completionPecentage)?.toFixed(2);
  }
}
