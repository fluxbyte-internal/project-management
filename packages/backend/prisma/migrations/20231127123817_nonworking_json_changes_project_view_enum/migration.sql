/*
  Warnings:

  - You are about to drop the column `list_of_non_working_days` on the `organisation` table. All the data in the column will be lost.
  - You are about to drop the column `userUserId` on the `organisation` table. All the data in the column will be lost.
  - The values [CALENDER] on the enum `Project_default_view` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `non_working_days` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `organisation` DROP FOREIGN KEY `Organisation_userUserId_fkey`;

-- AlterTable
ALTER TABLE `organisation` DROP COLUMN `list_of_non_working_days`,
    DROP COLUMN `userUserId`,
    ADD COLUMN `non_working_days` JSON NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `default_view` ENUM('KANBAN', 'GANTT', 'CALENDAR', 'LIST') NOT NULL DEFAULT 'LIST';
