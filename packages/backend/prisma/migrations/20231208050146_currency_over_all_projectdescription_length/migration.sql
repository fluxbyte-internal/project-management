/*
  Warnings:

  - Added the required column `currency` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `overall_track` ENUM('SUNNY', 'CLOUDY', 'RAINY', 'STORMY') NOT NULL DEFAULT 'SUNNY',
    MODIFY `project_description` VARCHAR(500) NOT NULL;
