/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `coupon` table. All the data in the column will be lost.
  - Added the required column `expiryTime` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupon` DROP COLUMN `expiryDate`,
    DROP COLUMN `startDate`,
    ADD COLUMN `expiryTime` DATETIME(3) NOT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
