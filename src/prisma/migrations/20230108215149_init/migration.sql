/*
  Warnings:

  - You are about to drop the `_producttosize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_producttouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_producttosize` DROP FOREIGN KEY `_ProductToSize_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttosize` DROP FOREIGN KEY `_ProductToSize_B_fkey`;

-- DropForeignKey
ALTER TABLE `_producttouser` DROP FOREIGN KEY `_ProductToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttouser` DROP FOREIGN KEY `_ProductToUser_B_fkey`;

-- DropTable
DROP TABLE `_producttosize`;

-- DropTable
DROP TABLE `_producttouser`;

-- CreateTable
CREATE TABLE `UserWishList` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserWishList_productId_userId_key`(`productId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productSizes` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `productSizes_productId_sizeId_key`(`productId`, `sizeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserWishList` ADD CONSTRAINT `UserWishList_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserWishList` ADD CONSTRAINT `UserWishList_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productSizes` ADD CONSTRAINT `productSizes_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productSizes` ADD CONSTRAINT `productSizes_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
