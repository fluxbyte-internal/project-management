-- AlterTable
ALTER TABLE `project` ADD COLUMN `overall_track` ENUM('SUNNY', 'CLOUDY', 'RAINY', 'STORMY') NOT NULL DEFAULT 'SUNNY';
