/*
  Warnings:

  - You are about to drop the `_SeenMessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SeenMessages" DROP CONSTRAINT "_SeenMessages_A_fkey";

-- DropForeignKey
ALTER TABLE "_SeenMessages" DROP CONSTRAINT "_SeenMessages_B_fkey";

-- AlterTable
ALTER TABLE "ConversationMember" ADD COLUMN     "lastReadAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "_SeenMessages";
