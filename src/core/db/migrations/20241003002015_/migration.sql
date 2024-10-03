/*
  Warnings:

  - You are about to drop the `Common` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DayTimetable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Period` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Space` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Week` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeekTimetable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_commonId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_commonId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_commonId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- DropForeignKey
ALTER TABLE "Week" DROP CONSTRAINT "Week_weekTimetableId_fkey";

-- DropForeignKey
ALTER TABLE "WeekTimetable" DROP CONSTRAINT "WeekTimetable_fridayId_fkey";

-- DropForeignKey
ALTER TABLE "WeekTimetable" DROP CONSTRAINT "WeekTimetable_mondayId_fkey";

-- DropForeignKey
ALTER TABLE "WeekTimetable" DROP CONSTRAINT "WeekTimetable_thursdayId_fkey";

-- DropForeignKey
ALTER TABLE "WeekTimetable" DROP CONSTRAINT "WeekTimetable_tuesdayId_fkey";

-- DropForeignKey
ALTER TABLE "WeekTimetable" DROP CONSTRAINT "WeekTimetable_wednesdayId_fkey";

-- DropForeignKey
ALTER TABLE "_DayTimetablePeriods" DROP CONSTRAINT "_DayTimetablePeriods_A_fkey";

-- DropForeignKey
ALTER TABLE "_DayTimetablePeriods" DROP CONSTRAINT "_DayTimetablePeriods_B_fkey";

-- DropTable
DROP TABLE "Common";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "DayTimetable";

-- DropTable
DROP TABLE "Period";

-- DropTable
DROP TABLE "Space";

-- DropTable
DROP TABLE "Teacher";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Week";

-- DropTable
DROP TABLE "WeekTimetable";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "google_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "is_onboarded" BOOLEAN NOT NULL DEFAULT false,
    "is_teacher" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT,
    "common_id" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "line" INTEGER NOT NULL,
    "year" "Year" NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "common_id" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primary_color" TEXT NOT NULL,
    "secondary_color" TEXT NOT NULL,

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
CREATE TABLE "periods" (
    "id" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "period_type" "PeriodType" NOT NULL,
    "name" TEXT,
    "line" INTEGER,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_timetables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "day_timetables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week_timetables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "monday_id" TEXT NOT NULL,
    "tuesday_id" TEXT NOT NULL,
    "wednesday_id" TEXT NOT NULL,
    "thursday_id" TEXT NOT NULL,
    "friday_id" TEXT NOT NULL,

    CONSTRAINT "week_timetables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weeks" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "week_timetable_id" TEXT,

    CONSTRAINT "weeks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_id_key" ON "teachers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_code_key" ON "teachers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_id_key" ON "courses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "commons_id_key" ON "commons"("id");

-- CreateIndex
CREATE UNIQUE INDEX "commons_name_key" ON "commons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_id_key" ON "spaces"("id");

-- CreateIndex
CREATE UNIQUE INDEX "periods_id_key" ON "periods"("id");

-- CreateIndex
CREATE UNIQUE INDEX "day_timetables_id_key" ON "day_timetables"("id");

-- CreateIndex
CREATE UNIQUE INDEX "day_timetables_name_key" ON "day_timetables"("name");

-- CreateIndex
CREATE UNIQUE INDEX "week_timetables_id_key" ON "week_timetables"("id");

-- CreateIndex
CREATE UNIQUE INDEX "week_timetables_name_key" ON "week_timetables"("name");

-- CreateIndex
CREATE UNIQUE INDEX "weeks_id_key" ON "weeks"("id");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_common_id_fkey" FOREIGN KEY ("common_id") REFERENCES "commons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_common_id_fkey" FOREIGN KEY ("common_id") REFERENCES "commons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_common_id_fkey" FOREIGN KEY ("common_id") REFERENCES "commons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_timetables" ADD CONSTRAINT "week_timetables_monday_id_fkey" FOREIGN KEY ("monday_id") REFERENCES "day_timetables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_timetables" ADD CONSTRAINT "week_timetables_tuesday_id_fkey" FOREIGN KEY ("tuesday_id") REFERENCES "day_timetables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_timetables" ADD CONSTRAINT "week_timetables_wednesday_id_fkey" FOREIGN KEY ("wednesday_id") REFERENCES "day_timetables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_timetables" ADD CONSTRAINT "week_timetables_thursday_id_fkey" FOREIGN KEY ("thursday_id") REFERENCES "day_timetables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_timetables" ADD CONSTRAINT "week_timetables_friday_id_fkey" FOREIGN KEY ("friday_id") REFERENCES "day_timetables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weeks" ADD CONSTRAINT "weeks_week_timetable_id_fkey" FOREIGN KEY ("week_timetable_id") REFERENCES "week_timetables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayTimetablePeriods" ADD CONSTRAINT "_DayTimetablePeriods_A_fkey" FOREIGN KEY ("A") REFERENCES "day_timetables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayTimetablePeriods" ADD CONSTRAINT "_DayTimetablePeriods_B_fkey" FOREIGN KEY ("B") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
