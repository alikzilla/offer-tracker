/*
  Warnings:

  - You are about to drop the column `userId` on the `Sheet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sheetId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_userId_fkey";

-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sheetId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_sheetId_key" ON "Sheet"("sheetId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
