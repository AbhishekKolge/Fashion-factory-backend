/*
  Warnings:

  - You are about to drop the column `finish` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sole` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `finish`,
    DROP COLUMN `sole`;
