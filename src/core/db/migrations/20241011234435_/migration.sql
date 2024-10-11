/*
  Warnings:

  - Added the required column `yearGroup` to the `weeks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "weeks" ADD COLUMN     "yearGroup" "Year" NOT NULL;
