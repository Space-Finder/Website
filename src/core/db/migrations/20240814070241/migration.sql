/*
  Warnings:

  - You are about to drop the column `kamarPassword` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `kamarVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `verificationtokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "kamarPassword",
DROP COLUMN "kamarVerified",
ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "is_onboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_teacher" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kamar_password" TEXT;

-- DropTable
DROP TABLE "verificationtokens";

-- CreateTable
CREATE TABLE "commons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "commons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "common_id" TEXT NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "line" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "commons_id_key" ON "commons"("id");

-- CreateIndex
CREATE UNIQUE INDEX "commons_name_key" ON "commons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_id_key" ON "spaces"("id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_id_key" ON "classes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_id_key" ON "teachers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_code_key" ON "teachers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_common_id_fkey" FOREIGN KEY ("common_id") REFERENCES "commons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
