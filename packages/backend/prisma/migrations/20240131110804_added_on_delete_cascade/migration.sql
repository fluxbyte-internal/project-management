-- DropForeignKey
ALTER TABLE `kanbancolumn` DROP FOREIGN KEY `KanbanColumn_created_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `kanbancolumn` DROP FOREIGN KEY `KanbanColumn_updated_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `organisation` DROP FOREIGN KEY `Organisation_created_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `organisation` DROP FOREIGN KEY `Organisation_updated_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_created_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_updated_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_created_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_updated_by_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `userprovider` DROP FOREIGN KEY `UserProvider_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `UserProvider` ADD CONSTRAINT `UserProvider_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organisation` ADD CONSTRAINT `Organisation_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Organisation` ADD CONSTRAINT `Organisation_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KanbanColumn` ADD CONSTRAINT `KanbanColumn_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KanbanColumn` ADD CONSTRAINT `KanbanColumn_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
