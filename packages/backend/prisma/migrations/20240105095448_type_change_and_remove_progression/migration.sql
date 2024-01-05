/*
  Warnings:

  - You are about to drop the column `progression_percentage` on the `project` table. All the data in the column will be lost.
  - You are about to alter the column `completion_percentage` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `progression_percentage`;

-- AlterTable
ALTER TABLE `task` MODIFY `completion_percentage` DOUBLE NULL;
