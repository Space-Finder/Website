import React from "react";

import { auth } from "@auth";
import prisma from "@db/orm";
import { getWeek } from "@lib/dates";
import Booking from "@components/booking/book";
import BookingMenu from "@components/booking/menu";

export const metadata = {
    title: "SpaceFinder | Book",
};

const Book = async ({
    searchParams,
}: {
    searchParams: {
        [key: string]: string | undefined;
    };
}) => {
    const session = await auth();
    if (!session) {
        return;
    }

    const currentWeek = getWeek();

    // either provided or current, and ensure its in the 1 - 52 range
    const week = Math.min(
        Math.max(1, Number(searchParams.week) || currentWeek + 1),
        52,
    );

    const teacherCode = searchParams.teacher;
    const teacher = await prisma.teacher.findUnique({
        where: teacherCode
            ? { code: teacherCode.toUpperCase() }
            : { userId: session.id },
        include: { courses: { include: { common: true } }, common: true },
    });

    // the common leaders teacher account
    const leaderTeacher = await prisma.teacher.findUnique({
        where: { userId: session.id },
    });

    const allTeachers = await prisma.teacher.findMany({
        ...(session.role == "LEADER" &&
            leaderTeacher && { where: { commonId: leaderTeacher.commonId } }),
    });
    // you cant book previous weeks
    if (week <= currentWeek) {
        return;
    }

    const courseId = searchParams.courseId || "";
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const courses = await prisma.course.findMany({
        where: { teacherId: teacher?.id },
    });

    if (!teacher && session.role !== "ADMIN") {
        return;
    }

    switch (session.role) {
        case "TEACHER":
            // teachers can only book themselves, and for next week only
            if (teacher?.userId !== session.id || week !== currentWeek + 1) {
                return "Illegal";
            }
            break;
        case "LEADER":
            // if the selected teacher is in a different common to the leader, they can't book for them
            if (leaderTeacher?.commonId !== teacher?.common.id) {
                return "no in your common";
            }
            break;
    }

    return (
        <main>
            <div className="flex flex-col gap-8 p-2 py-12">
                <section>
                    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                        <BookingMenu
                            teacher={teacher?.code || ""}
                            teachers={allTeachers}
                            course={course}
                            courses={courses}
                            week={week}
                        />

                        {course && teacher && (
                            <Booking
                                week={week}
                                teacher={teacher}
                                course={course}
                            />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Book;
