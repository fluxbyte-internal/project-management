/*
  Warnings:

  - A unique constraint covering the columns `[task_id,assgined_to_user_id]` on the table `TaskAssignUsers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dependecies` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `due_date` DATETIME(3) NULL,
    MODIFY `dependecies` ENUM('BLOCKING', 'WAITING_ON', 'NO_DEPENDENCIES') NOT NULL DEFAULT 'NO_DEPENDENCIES',
    MODIFY `milestone_indicator` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `TaskAssignUsers_task_id_assgined_to_user_id_key` ON `TaskAssignUsers`(`task_id`, `assgined_to_user_id`);
