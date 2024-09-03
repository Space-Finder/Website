/*
  Warnings:

  - Made the column `color` on table `commons` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color2` on table `commons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "commons" ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color2" SET NOT NULL;
