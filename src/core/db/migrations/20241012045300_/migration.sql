/*
  Warnings:

  - You are about to drop the column `day` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `period_number` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "day",
ADD COLUMN     "period_number" INTEGER NOT NULL;
