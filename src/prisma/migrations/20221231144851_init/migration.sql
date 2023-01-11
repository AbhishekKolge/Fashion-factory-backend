/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_email_idx` ON `user`;

-- CreateIndex
CREATE UNIQUE INDEX `Token_userId_key` ON `Token`(`userId`);

-- CreateIndex
CREATE INDEX `User_email_contactNo_idx` ON `User`(`email`, `contactNo`);
