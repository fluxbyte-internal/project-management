import cron from "node-cron";
import { getClientByTenantId } from "../config/db.js";
import { EmailService } from "./email.services.js";
import { NotificationTypeEnum } from "@prisma/client";

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
          const prisma = await getClientByTenantId("root");
          const tasks = await prisma.task.findMany({
            where: {
              deletedAt: null,
              dueDate: {
                equals: new Date(),
              },
            },
            include: {
              assignedUsers: {
                include: {
                  user: true,
                },
              },
            },
          });
          for (const task of tasks) {
            const assignedUsers = task.assignedUsers.map((user) => user);
            for (const user of assignedUsers) {
              const email = user.user.email;
              const userId = user.assginedToUserId;
              const subjectMessage = `Task due today`;
              const message = `Task '${task.taskName}' is due today.}`;

              //Send Notification
              await prisma.notification.sendNotification(
                NotificationTypeEnum.TASK,
                message,
                userId,
                userId,
                task.taskId
              );

              //Send Email
              await EmailService.sendEmail(email, subjectMessage, message);
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
