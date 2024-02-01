-- AlterTable
ALTER TABLE `history` MODIFY `type` ENUM('PROJECT', 'TASK') NOT NULL;

-- AlterTable
ALTER TABLE `project` MODIFY `project_description` VARCHAR(500) NULL;
