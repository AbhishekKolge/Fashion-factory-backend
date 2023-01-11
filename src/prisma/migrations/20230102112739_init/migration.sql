/*
  Warnings:

  - You are about to drop the column `inValid` on the `token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `token` DROP COLUMN `inValid`,
    ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT false;
