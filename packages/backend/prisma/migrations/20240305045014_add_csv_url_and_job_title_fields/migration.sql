-- AlterTable
ALTER TABLE `organisation` ADD COLUMN `holiday_csv_url` VARCHAR(191) NULL,
    ADD COLUMN `job_titles_of_org` JSON NULL;
