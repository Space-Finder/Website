/*
  Warnings:

  - Added the required column `common_id` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "common_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_common_id_fkey" FOREIGN KEY ("common_id") REFERENCES "commons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
