import cron from "node-cron";
import { getClientByTenantId } from "../config/db.js";
import { EmailService } from "./email.services.js";
import { NotificationTypeEnum } from "@prisma/client";
import { taskEndDate } from "../utils/calcualteTaskEndDate.js";

export class CronService {
  static async oneMonthCron() {
    cron.schedule(
      "0 0 1 * *",
      async () => {
        try {
          console.log("called-this oneMonthCron");
        } catch (error) {
          console.error("Error in oneMonthCron:", error);
        }
      },
      {
        scheduled: true,
      }
    );
  }

  static async sendNotificationAndEmailToTaskDueDate() {
    cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          const currentDate = new Date();
          const prisma = await getClientByTenantId("root");
          const tasks = await prisma.task.findMany({
            where: {
              deletedAt: null,
            },
            include: {
              assignedUsers: {
                where: { deletedAt: null },
                include: {
                  user: true,
                },
              },
              project: {
                select: {
                  organisationId: true,
                },
              },
            },
          });
          for (const task of tasks) {
            const endDate = await taskEndDate(
              task,
              "root",
              task.project.organisationId
            );

            // Convert endDate to date object
            const taskEndDateObj = new Date(endDate);

            if (
              currentDate.getDate() === taskEndDateObj.getDate() &&
              currentDate.getMonth() === taskEndDateObj.getMonth() &&
              currentDate.getFullYear() === taskEndDateObj.getFullYear()
            ) {
              let message = `
                Hello,
  
                Please note that these tasks are due today:
                Task '${task.taskName}' is due today.
  
                Best Regards,
                ProjectChef Support Team
              `;
              const assignedUsers = task.assignedUsers.map((user) => user);
              for (const user of assignedUsers) {
                const email = user.user.email;
                const userId = user.assginedToUserId;
                const subjectMessage = `ProjectChef: Task Due Today`;

                //Send Notification
                await prisma.notification.sendNotification(
                  NotificationTypeEnum.TASK,
                  message,
                  userId,
                  userId,
                  task.taskId
                );

                // Send Email
                await EmailService.sendEmail(email, subjectMessage, message);
              }
            }
          }
        } catch (error) {
          console.error(
            "Error in sendNotificationAndEmailToTaskDueDate:",
            error
          );
        }
      },
      { scheduled: true }
    );
  }
}
