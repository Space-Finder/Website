-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- DropForeignKey
ALTER TABLE "weeks" DROP CONSTRAINT "weeks_week_timetable_id_fkey";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "week_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_id_key" ON "Booking"("id");

-- AddForeignKey
ALTER TABLE "weeks" ADD CONSTRAINT "weeks_week_timetable_id_fkey" FOREIGN KEY ("week_timetable_id") REFERENCES "week_timetables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_week_id_fkey" FOREIGN KEY ("week_id") REFERENCES "weeks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
