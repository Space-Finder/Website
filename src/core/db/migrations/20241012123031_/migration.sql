/*
  Warnings:

  - Added the required column `period_number` to the `periods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "periods" ADD COLUMN     "period_number" INTEGER NOT NULL;
