/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_email_password_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`;

-- CreateTable
CREATE TABLE `UserProvider` (
    `user_provider_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `id_or_password` VARCHAR(191) NOT NULL,
    `provider_type` ENUM('EMAIL', 'GOOGLE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `UserProvider_user_id_provider_type_key`(`user_id`, `provider_type`),
    PRIMARY KEY (`user_provider_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProvider` ADD CONSTRAINT `UserProvider_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
