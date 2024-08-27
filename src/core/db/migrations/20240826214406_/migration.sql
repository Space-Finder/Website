/*
  Warnings:

  - Added the required column `code` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "code" TEXT NOT NULL;
