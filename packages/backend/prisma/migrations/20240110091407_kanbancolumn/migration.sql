-- CreateTable
CREATE TABLE `KanbanColumn` (
    `kanban_column_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `percentage` DOUBLE NULL,
    `created_by_user_id` VARCHAR(191) NOT NULL,
    `updated_by_user_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `KanbanColumn_kanban_column_id_project_id_key`(`kanban_column_id`, `project_id`),
    PRIMARY KEY (`kanban_column_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KanbanColumn` ADD CONSTRAINT `KanbanColumn_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KanbanColumn` ADD CONSTRAINT `KanbanColumn_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KanbanColumn` ADD CONSTRAINT `KanbanColumn_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
