/*
  Warnings:

  - You are about to drop the column `chatRoomId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_chatRoomId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "chatRoomId";

-- DropTable
DROP TABLE "ChatRoom";
