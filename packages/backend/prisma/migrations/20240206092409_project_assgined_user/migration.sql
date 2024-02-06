-- CreateTable
CREATE TABLE `ProjectAssignUsers` (
    `project_assign_users_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `assgined_to_user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProjectAssignUsers_project_id_assgined_to_user_id_key`(`project_id`, `assgined_to_user_id`),
    PRIMARY KEY (`project_assign_users_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectAssignUsers` ADD CONSTRAINT `ProjectAssignUsers_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectAssignUsers` ADD CONSTRAINT `ProjectAssignUsers_assgined_to_user_id_fkey` FOREIGN KEY (`assgined_to_user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
