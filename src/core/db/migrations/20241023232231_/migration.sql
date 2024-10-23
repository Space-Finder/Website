/*
  Warnings:

  - Added the required column `week` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "week" INTEGER NOT NULL;
