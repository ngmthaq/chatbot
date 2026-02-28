/*
  Warnings:

  - You are about to drop the column `role` on the `Rbac` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId,module,action]` on the table `Rbac` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleId` to the `Rbac` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Rbac_role_module_action_key` ON `Rbac`;

-- AlterTable
ALTER TABLE `Rbac` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Rbac_roleId_module_action_key` ON `Rbac`(`roleId`, `module`, `action`);

-- AddForeignKey
ALTER TABLE `Rbac` ADD CONSTRAINT `Rbac_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
