/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commonId` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "commonId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_commonId_fkey" FOREIGN KEY ("commonId") REFERENCES "commons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
