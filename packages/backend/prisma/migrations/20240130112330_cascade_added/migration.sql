-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_organisation_id_fkey`;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE CASCADE ON UPDATE CASCADE;
