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

-- AlterTable
ALTER TABLE `comments` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `consoleuser` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `kanbancolumn` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `organisation` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `resetpassword` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `taskassignusers` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `taskattachment` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `taskdependencies` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `tenant` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `userorganisation` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `userprovider` ADD COLUMN `deleted_at` DATETIME(3) NULL;

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
