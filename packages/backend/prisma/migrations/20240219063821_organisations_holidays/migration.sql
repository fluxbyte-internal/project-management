-- CreateTable
CREATE TABLE `OrganisationHolidays` (
    `org_holidays_id` VARCHAR(191) NOT NULL,
    `organisation_id` VARCHAR(191) NOT NULL,
    `holiday_startDate` DATETIME(3) NOT NULL,
    `holiday_endDate` DATETIME(3) NULL,
    `holiday_type` VARCHAR(191) NULL,
    `holiday_reason` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `OrganisationHolidays_organisation_id_holiday_startDate_idx`(`organisation_id`, `holiday_startDate`),
    UNIQUE INDEX `OrganisationHolidays_organisation_id_holiday_startDate_holid_key`(`organisation_id`, `holiday_startDate`, `holiday_endDate`),
    PRIMARY KEY (`org_holidays_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrganisationHolidays` ADD CONSTRAINT `OrganisationHolidays_organisation_id_fkey` FOREIGN KEY (`organisation_id`) REFERENCES `Organisation`(`organisation_id`) ON DELETE CASCADE ON UPDATE CASCADE;
