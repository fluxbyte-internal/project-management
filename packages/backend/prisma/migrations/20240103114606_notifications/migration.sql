-- CreateTable
CREATE TABLE `Notification` (
    `notification_id` VARCHAR(191) NOT NULL,
    `type` ENUM('PROJECT', 'TASK') NOT NULL,
    `reference_id` VARCHAR(191) NOT NULL,
    `sent_by` VARCHAR(191) NOT NULL,
    `sent_to` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `read_at` DATETIME(3) NOT NULL,

    INDEX `Notification_sent_by_sent_to_reference_id_idx`(`sent_by`, `sent_to`, `reference_id`),
    UNIQUE INDEX `Notification_type_reference_id_sent_by_sent_to_is_read_key`(`type`, `reference_id`, `sent_by`, `sent_to`, `is_read`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `task_notification` FOREIGN KEY (`reference_id`) REFERENCES `Task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `project_notification` FOREIGN KEY (`reference_id`) REFERENCES `Project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_sent_by_fkey` FOREIGN KEY (`sent_by`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_sent_to_fkey` FOREIGN KEY (`sent_to`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
