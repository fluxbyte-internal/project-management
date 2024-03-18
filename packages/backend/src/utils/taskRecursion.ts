import { ProjectStatusEnum, TaskStatusEnum } from "@prisma/client";
import { getClientByTenantId } from "../config/db.js";
import { calculationSubTaskProgression } from "./calculationSubTaskProgression.js";

export const checkTaskStatus = async (
  taskId: string,
  tenantId: string,
  organisationId: string
) => {
  const prisma = await getClientByTenantId(tenantId);
  const findTask = await prisma.task.findFirst({
    where: {
      taskId,
      deletedAt: null,
    },
    include: {
      subtasks: {
        where: { deletedAt: null },
        include: {
          subtasks: {
            where: { deletedAt: null },
            include: {
              subtasks: true,
            },
          },
        },
      },
      project: true,
      parent: true,
    },
  });
  if (findTask) {
    const completionPecentage =
      (await calculationSubTaskProgression(
        findTask,
        tenantId,
        organisationId
      )) ?? 0;

    let taskStatus = TaskStatusEnum.NOT_STARTED as TaskStatusEnum;
    if (completionPecentage !== undefined) {
      if (Number(completionPecentage) === 0) {
        taskStatus = TaskStatusEnum.NOT_STARTED;
      } else if (
        Number(completionPecentage) > 0 &&
        Number(completionPecentage) < 99
      ) {
        taskStatus = TaskStatusEnum.IN_PROGRESS;
      } else if (Number(completionPecentage) === 100) {
        taskStatus = TaskStatusEnum.COMPLETED;
      }
    }

    if (completionPecentage || completionPecentage === 0) {
      // Handle project status based on task update
      await prisma.$transaction([
        prisma.project.update({
          where: {
            projectId: findTask.project.projectId,
          },
          data: {
            status: ProjectStatusEnum.ACTIVE,
          },
        }),
        prisma.task.update({
          where: { taskId },
          data: {
            status: taskStatus,
          },
        }),
      ]);
    }
    if (findTask.parent && findTask.parent.taskId) {
      await checkTaskStatus(findTask.parent.taskId, tenantId, organisationId);
    }
  }
};
