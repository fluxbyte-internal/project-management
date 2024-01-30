/*
  Warnings:

  - The values [SUPER_ADMIN,OPERATOR] on the enum `UserOrganisation_role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `uploaded_by` to the `TaskAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dependencies_added_by` to the `TaskDependencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `taskattachment` ADD COLUMN `uploaded_by` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `taskdependencies` ADD COLUMN `dependencies_added_by` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userorganisation` MODIFY `role` ENUM('ADMINISTRATOR', 'PROJECT_MANAGER', 'TEAM_MEMBER') NOT NULL;

-- AddForeignKey
ALTER TABLE `TaskDependencies` ADD CONSTRAINT `TaskDependencies_dependencies_added_by_fkey` FOREIGN KEY (`dependencies_added_by`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskAttachment` ADD CONSTRAINT `TaskAttachment_uploaded_by_fkey` FOREIGN KEY (`uploaded_by`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
