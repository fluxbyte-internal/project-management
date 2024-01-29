/*
  Warnings:

  - A unique constraint covering the columns `[organisation_id,project_name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Project_organisation_id_project_name_key` ON `Project`(`organisation_id`, `project_name`);
