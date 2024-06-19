/*
  Warnings:

  - The values [GOOGLE] on the enum `LoginType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoginType_new" AS ENUM ('ID_PW', 'KAKAO', 'NAVER');
ALTER TABLE "User" ALTER COLUMN "loginType" TYPE "LoginType_new" USING ("loginType"::text::"LoginType_new");
ALTER TYPE "LoginType" RENAME TO "LoginType_old";
ALTER TYPE "LoginType_new" RENAME TO "LoginType";
DROP TYPE "LoginType_old";
COMMIT;
