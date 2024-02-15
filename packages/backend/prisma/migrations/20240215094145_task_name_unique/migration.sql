/*
  Warnings:

  - A unique constraint covering the columns `[project_id,task_name]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Task_project_id_task_name_key` ON `Task`(`project_id`, `task_name`);
