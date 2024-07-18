/*
  Warnings:

  - You are about to drop the column `hostId` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_hostId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "hostId";
