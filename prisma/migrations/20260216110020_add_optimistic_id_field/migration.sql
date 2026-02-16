/*
  Warnings:

  - A unique constraint covering the columns `[optimisticId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "optimisticId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_optimisticId_key" ON "Message"("optimisticId");
