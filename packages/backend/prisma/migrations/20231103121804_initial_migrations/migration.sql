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
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organisation` (
    `organisation_id` VARCHAR(191) NOT NULL,
    `organisation_name` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `list_of_non_working_days` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `tenant_id` VARCHAR(191) NULL,

    INDEX `Organisation_organisation_id_tenant_id_idx`(`organisation_id`, `tenant_id`),
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

-- AddForeignKey
ALTER TABLE `UserOrganisation` ADD CONSTRAINT `UserOrganisation_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOrganisation` ADD CONSTRAINT `UserOrganisation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
