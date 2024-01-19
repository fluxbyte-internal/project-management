/*
  Warnings:

  - You are about to alter the column `status` on the `task` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `Enum(EnumId(6))`.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `milestone_status` ENUM('NOT_STARTED', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    MODIFY `status` ENUM('PLANNED', 'TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'PLANNED';
