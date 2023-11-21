-- CreateTable
CREATE TABLE `Project` (
    `project_id` VARCHAR(191) NOT NULL,
    `organisation_id` VARCHAR(191) NOT NULL,
    `project_name` VARCHAR(191) NOT NULL,
    `project_description` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL,
    `estimated_end_date` DATETIME(3) NULL,
    `actual_end_date` DATETIME(3) NULL,
    `status` ENUM('NOT_STARTED', 'ACTIVE', 'ON_HOLD', 'CLOSED') NOT NULL DEFAULT 'NOT_STARTED',
    `default_view` ENUM('KANBAN', 'GANTT', 'CALENDER', 'LIST') NOT NULL DEFAULT 'LIST',
    `time_track` VARCHAR(191) NULL,
    `budget_track` VARCHAR(191) NULL,
    `estimated_budget` VARCHAR(191) NULL,
    `actual_cost` VARCHAR(191) NULL,
    `progression_percentage` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Project_project_id_key`(`project_id`),
    INDEX `Project_project_id_organisation_id_idx`(`project_id`, `organisation_id`),
    PRIMARY KEY (`project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
