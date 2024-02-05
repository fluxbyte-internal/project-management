-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_created_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_organisation_id_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_updated_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_created_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_parent_task_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_updated_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `userorganisation` DROP FOREIGN KEY `UserOrganisation_organisation_id_fkey`;

-- AddForeignKey
ALTER TABLE `UserOrganisation` ADD CONSTRAINT `UserOrganisation_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_parent_task_id_fkey` FOREIGN KEY (`parent_task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;
