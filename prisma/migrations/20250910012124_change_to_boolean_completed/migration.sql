/*
  Warnings:

  - You are about to drop the column `value` on the `ActivityLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ActivityLog" DROP COLUMN "value",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true;
