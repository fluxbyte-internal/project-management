import cron from "node-cron";
import { getClientByTenantId } from "../config/db.js";
import { EmailService } from "./email.services.js";
import { NotificationTypeEnum } from "@prisma/client";

export class CronService {
  static async oneDayCron() {
    cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          await this.sendNotificationAndEmailToTaskDueDate();
        } catch (error) {
          console.error("Error in oneDayCron:", error);
        }
      },
      {
        scheduled: true,
      }
    );
  }

  static async sendNotificationAndEmailToTaskDueDate() {
    const prisma = await getClientByTenantId("root");
    const tasks = await prisma.task.findMany({
      where: {
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
  }
}
