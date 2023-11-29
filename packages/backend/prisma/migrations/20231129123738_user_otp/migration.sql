/*
  Warnings:

  - You are about to alter the column `status` on the `organisation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `organisation` MODIFY `status` ENUM('ACTIVE', 'DEACTIVE') NOT NULL;

-- CreateTable
CREATE TABLE `UserOTP` (
    `otp_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `expiry_time` DATETIME(3) NOT NULL,
    `is_used` BOOLEAN NOT NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserOTP_user_id_otp_idx`(`user_id`, `otp`),
    PRIMARY KEY (`otp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOTP` ADD CONSTRAINT `UserOTP_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
