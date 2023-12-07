/*
  Warnings:

  - Added the required column `currency` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` ADD COLUMN `currency` VARCHAR(191) NOT NULL;
