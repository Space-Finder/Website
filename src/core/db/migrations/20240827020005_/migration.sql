/*
  Warnings:

  - You are about to drop the column `commonId` on the `teachers` table. All the data in the column will be lost.
  - Added the required column `common_id` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_commonId_fkey";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "commonId",
ADD COLUMN     "common_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_common_id_fkey" FOREIGN KEY ("common_id") REFERENCES "commons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
