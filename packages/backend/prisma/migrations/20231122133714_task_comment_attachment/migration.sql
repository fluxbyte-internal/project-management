/*
  Warnings:

  - You are about to drop the column `actual_end_date` on the `project` table. All the data in the column will be lost.
  - Made the column `project_description` on table `project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estimated_end_date` on table `project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estimated_budget` on table `project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `actual_end_date`,
    MODIFY `project_description` VARCHAR(191) NOT NULL,
    MODIFY `estimated_end_date` DATETIME(3) NOT NULL,
    MODIFY `estimated_budget` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Task` (
    `task_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `task_name` VARCHAR(191) NOT NULL,
    `task_description` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `completion_percentage` VARCHAR(191) NULL,
    `status` ENUM('NOT_STARTED', 'COMPLETED') NOT NULL,
    `assignee` VARCHAR(191) NOT NULL,
    `dependecies` ENUM('BLOCKING', 'WAITING_ON') NOT NULL,
    `milestone_indicator` BOOLEAN NOT NULL,
    `flag` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `parent_task_id` VARCHAR(191) NULL,

    INDEX `Task_task_id_project_id_assignee_idx`(`task_id`, `project_id`, `assignee`),
    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskAttachment` (
    `attachment_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `task_id` VARCHAR(191) NOT NULL,

    INDEX `TaskAttachment_task_id_idx`(`task_id`),
    PRIMARY KEY (`attachment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `comment_id` VARCHAR(191) NOT NULL,
    `task_id` VARCHAR(191) NOT NULL,
    `comment_text` VARCHAR(191) NOT NULL,
    `comment_by_user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Comments_comment_id_comment_by_user_id_idx`(`comment_id`, `comment_by_user_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_parent_task_id_fkey` FOREIGN KEY (`parent_task_id`) REFERENCES `Task`(`task_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskAttachment` ADD CONSTRAINT `TaskAttachment_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_comment_by_user_id_fkey` FOREIGN KEY (`comment_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
