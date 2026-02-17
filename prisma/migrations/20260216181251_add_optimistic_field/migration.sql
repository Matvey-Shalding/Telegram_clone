/*
  Warnings:

  - You are about to drop the column `optimisticId` on the `Message` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Message_optimisticId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "optimisticId",
ADD COLUMN     "optimistic" BOOLEAN DEFAULT false;
