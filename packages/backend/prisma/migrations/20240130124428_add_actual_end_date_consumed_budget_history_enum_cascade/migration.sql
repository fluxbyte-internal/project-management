/*
  Warnings:

  - Added the required column `actual_end_date` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_organisation_id_fkey`;

-- AlterTable
ALTER TABLE `history` MODIFY `type` ENUM('PROJECT', 'TASK') NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `actual_end_date` DATETIME(3) NOT NULL,
    ADD COLUMN `consumed_budget` VARCHAR(191) NOT NULL DEFAULT '0';

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE CASCADE ON UPDATE CASCADE;
