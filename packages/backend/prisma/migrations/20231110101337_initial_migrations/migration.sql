-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `time_zone` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `avatar_img` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_user_id_email_idx`(`user_id`, `email`),
    UNIQUE INDEX `User_email_password_key`(`email`, `password`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organisation` (
    `organisation_id` VARCHAR(191) NOT NULL,
    `organisation_name` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `list_of_non_working_days` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `tenant_id` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,

    INDEX `Organisation_organisation_id_tenant_id_idx`(`organisation_id`, `tenant_id`),
    UNIQUE INDEX `Organisation_organisation_name_industry_created_by_key`(`organisation_name`, `industry`, `created_by`),
    PRIMARY KEY (`organisation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tenant` (
    `tenant_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `connection_string` VARCHAR(191) NULL,

    INDEX `Tenant_tenant_id_idx`(`tenant_id`),
    PRIMARY KEY (`tenant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserOrganisation` (
    `user_organisation_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `organisation_id` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMINISTRATOR', 'PROJECT_MANAGER', 'TEAM_MEMBER', 'SUPER_ADMIN', 'OPERATOR') NOT NULL,
    `job_title` VARCHAR(191) NULL,
    `task_colour` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `UserOrganisation_user_id_organisation_id_role_idx`(`user_id`, `organisation_id`, `role`),
    UNIQUE INDEX `UserOrganisation_user_id_organisation_id_key`(`user_id`, `organisation_id`),
    PRIMARY KEY (`user_organisation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Task` (
    `task_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `task_name` VARCHAR(191) NOT NULL,
    `task_description` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `completion_percentage` VARCHAR(191) NULL,
    `status` ENUM('NOT_STARTED', 'COMPLETED') NOT NULL,
    `assignee` VARCHAR(191) NOT NULL,
    `document_attachments` VARCHAR(191) NULL,
    `dependecies` ENUM('BLOCKING', 'WAITING_ON') NOT NULL,
    `milestone_indicator` BOOLEAN NOT NULL,
    `flag` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `parent_task_id` VARCHAR(191) NULL,

    INDEX `Task_task_id_project_id_assignee_idx`(`task_id`, `project_id`, `assignee`),
    PRIMARY KEY (`task_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `history_id` VARCHAR(191) NOT NULL,
    `history_reference_id` VARCHAR(191) NOT NULL,
    `history_type` VARCHAR(191) NOT NULL,
    `history_data` JSON NOT NULL,
    `history_created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `History_history_id_history_reference_id_history_created_by_idx`(`history_id`, `history_reference_id`, `history_created_by`),
    PRIMARY KEY (`history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `comment_id` VARCHAR(191) NOT NULL,
    `task_id` VARCHAR(191) NOT NULL,
    `comment_text` VARCHAR(191) NOT NULL,
    `comment_by_user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Comments_comment_id_comment_by_user_id_idx`(`comment_id`, `comment_by_user_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOrganisation` ADD CONSTRAINT `UserOrganisation_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOrganisation` ADD CONSTRAINT `UserOrganisation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_parent_task_id_fkey` FOREIGN KEY (`parent_task_id`) REFERENCES `Task`(`task_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `Task`(`task_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_comment_by_user_id_fkey` FOREIGN KEY (`comment_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
