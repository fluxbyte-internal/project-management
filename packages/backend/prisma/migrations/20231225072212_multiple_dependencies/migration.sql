/*
  Warnings:

  - You are about to drop the column `dependant_task_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `dependecies` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_dependant_task_id_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `dependant_task_id`,
    DROP COLUMN `dependecies`;

-- CreateTable
CREATE TABLE `TaskDependencies` (
    `dependencies_id` VARCHAR(191) NOT NULL,
    `dependent_task_id` VARCHAR(191) NOT NULL,
    `dependent_type` ENUM('BLOCKING', 'WAITING_ON') NOT NULL,
    `dependent_on_task_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `TaskDependencies_dependent_task_id_dependent_type_dependent__idx`(`dependent_task_id`, `dependent_type`, `dependent_on_task_id`),
    UNIQUE INDEX `TaskDependencies_dependent_task_id_dependent_type_dependent__key`(`dependent_task_id`, `dependent_type`, `dependent_on_task_id`),
    PRIMARY KEY (`dependencies_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaskDependencies` ADD CONSTRAINT `TaskDependencies_dependent_task_id_fkey` FOREIGN KEY (`dependent_task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskDependencies` ADD CONSTRAINT `TaskDependencies_dependent_on_task_id_fkey` FOREIGN KEY (`dependent_on_task_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;
