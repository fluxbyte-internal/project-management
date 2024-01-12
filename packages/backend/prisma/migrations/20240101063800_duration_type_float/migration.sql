/*
  Warnings:

  - You are about to alter the column `duration` on the `task` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `task` MODIFY `duration` DOUBLE NOT NULL;
