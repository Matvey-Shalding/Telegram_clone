-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "lastMessagePreview" TEXT,
ALTER COLUMN "lastMessageAt" DROP NOT NULL,
ALTER COLUMN "lastMessageAt" DROP DEFAULT;
