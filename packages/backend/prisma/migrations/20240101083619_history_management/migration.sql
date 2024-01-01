-- CreateTable
CREATE TABLE `History` (
    `history_id` VARCHAR(191) NOT NULL,
    `reference_id` VARCHAR(191) NOT NULL,
    `type` ENUM('TASK', 'PROJECT') NOT NULL,
    `data` JSON NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `History_reference_id_created_by_idx`(`reference_id`, `created_by`),
    PRIMARY KEY (`history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_reference_id_fkey` FOREIGN KEY (`reference_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
