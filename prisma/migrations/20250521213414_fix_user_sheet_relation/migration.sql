/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sheetId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_userId_key" ON "Sheet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_sheetId_key" ON "User"("sheetId");
