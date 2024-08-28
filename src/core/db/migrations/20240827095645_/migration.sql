/*
  Warnings:

  - You are about to drop the column `user_id` on the `classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_user_id_fkey";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "user_id";
