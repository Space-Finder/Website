/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('CLASS', 'BREAK', 'LA', 'CUSTOM');

-- CreateEnum
CREATE TYPE "Year" AS ENUM ('Y11', 'Y12', 'Y13');

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "isTeacher" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commonId" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line" INTEGER NOT NULL,
    "year" "Year" NOT NULL,
    "teacherId" TEXT NOT NULL,
    "commonId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Common" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,

    CONSTRAINT "Common_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "commonId" TEXT NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "periodType" "PeriodType" NOT NULL,
    "name" TEXT,
    "line" INTEGER,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayTimetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DayTimetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeekTimetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mondayId" TEXT NOT NULL,
    "tuesdayId" TEXT NOT NULL,
    "wednesdayId" TEXT NOT NULL,
    "thursdayId" TEXT NOT NULL,
    "fridayId" TEXT NOT NULL,

    CONSTRAINT "WeekTimetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "weekTimetableId" TEXT,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DayTimetablePeriods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_code_key" ON "Teacher"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_key" ON "Course"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Common_id_key" ON "Common"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Common_name_key" ON "Common"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Space_id_key" ON "Space"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Period_id_key" ON "Period"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DayTimetable_id_key" ON "DayTimetable"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DayTimetable_name_key" ON "DayTimetable"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WeekTimetable_id_key" ON "WeekTimetable"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WeekTimetable_name_key" ON "WeekTimetable"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Week_id_key" ON "Week"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_DayTimetablePeriods_AB_unique" ON "_DayTimetablePeriods"("A", "B");

-- CreateIndex
CREATE INDEX "_DayTimetablePeriods_B_index" ON "_DayTimetablePeriods"("B");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_commonId_fkey" FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_commonId_fkey" FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_commonId_fkey" FOREIGN KEY ("commonId") REFERENCES "Common"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekTimetable" ADD CONSTRAINT "WeekTimetable_mondayId_fkey" FOREIGN KEY ("mondayId") REFERENCES "DayTimetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekTimetable" ADD CONSTRAINT "WeekTimetable_tuesdayId_fkey" FOREIGN KEY ("tuesdayId") REFERENCES "DayTimetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekTimetable" ADD CONSTRAINT "WeekTimetable_wednesdayId_fkey" FOREIGN KEY ("wednesdayId") REFERENCES "DayTimetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekTimetable" ADD CONSTRAINT "WeekTimetable_thursdayId_fkey" FOREIGN KEY ("thursdayId") REFERENCES "DayTimetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekTimetable" ADD CONSTRAINT "WeekTimetable_fridayId_fkey" FOREIGN KEY ("fridayId") REFERENCES "DayTimetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_weekTimetableId_fkey" FOREIGN KEY ("weekTimetableId") REFERENCES "WeekTimetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayTimetablePeriods" ADD CONSTRAINT "_DayTimetablePeriods_A_fkey" FOREIGN KEY ("A") REFERENCES "DayTimetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayTimetablePeriods" ADD CONSTRAINT "_DayTimetablePeriods_B_fkey" FOREIGN KEY ("B") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
