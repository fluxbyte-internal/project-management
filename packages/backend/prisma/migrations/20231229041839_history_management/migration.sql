-- CreateTable
CREATE TABLE `History` (
    `history_id` VARCHAR(191) NOT NULL,
    `history_reference_id` VARCHAR(191) NOT NULL,
    `history_type` ENUM('TASK', 'PROJECT') NOT NULL,
    `history_data` JSON NOT NULL,
    `history_message` VARCHAR(191) NOT NULL,
    `history_created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `History_history_reference_id_history_created_by_idx`(`history_reference_id`, `history_created_by`),
    PRIMARY KEY (`history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_history_created_by_fkey` FOREIGN KEY (`history_created_by`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
