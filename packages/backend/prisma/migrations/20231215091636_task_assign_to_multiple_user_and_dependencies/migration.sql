/*
  Warnings:

  - You are about to drop the column `assgined_to_user_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `flag` on the `task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dependant_task_id]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_assgined_to_user_id_fkey`;

-- DropIndex
DROP INDEX `Task_task_id_project_id_assgined_to_user_id_idx` ON `task`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `assgined_to_user_id`,
    DROP COLUMN `flag`,
    ADD COLUMN `dependant_task_id` VARCHAR(191) NULL,
    MODIFY `dependecies` ENUM('BLOCKING', 'WAITING_ON') NULL;

-- CreateTable
CREATE TABLE `TaskAssignUsers` (
    `task_assign_users_id` VARCHAR(191) NOT NULL,
    `task_id` VARCHAR(191) NOT NULL,
    `assgined_to_user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`task_assign_users_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Task_dependant_task_id_key` ON `Task`(`dependant_task_id`);

-- CreateIndex
CREATE INDEX `Task_task_id_project_id_idx` ON `Task`(`task_id`, `project_id`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_dependant_task_id_fkey` FOREIGN KEY (`dependant_task_id`) REFERENCES `Task`(`task_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskAssignUsers` ADD CONSTRAINT `TaskAssignUsers_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskAssignUsers` ADD CONSTRAINT `TaskAssignUsers_assgined_to_user_id_fkey` FOREIGN KEY (`assgined_to_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
