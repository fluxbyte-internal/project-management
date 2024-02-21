/*
  Warnings:

  - You are about to alter the column `status` on the `task` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(11))` to `Enum(EnumId(11))`.
  - A unique constraint covering the columns `[project_id,task_name]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `task` MODIFY `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED';

-- CreateIndex
CREATE UNIQUE INDEX `Task_project_id_task_name_key` ON `Task`(`project_id`, `task_name`);
