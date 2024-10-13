import React from "react";

import { auth } from "@auth";
import prisma from "@db/orm";
import { getWeek } from "@lib/dates";
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
        ...(leaderTeacher && { where: { commonId: leaderTeacher.commonId } }),
    });

    // you cant book previous weeks
    if (week <= currentWeek) {
        return;
    }

    if (!teacher) {
        if (session.role !== "ADMIN") {
            return;
        }

        return (
            <main>
                <div className="flex flex-col gap-8 p-2 py-12">
                    <section>
                        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                            <BookingMenu
                                teacher={""}
                                teachers={allTeachers}
                                week={week}
                            />
                        </div>
                    </section>
                </div>
            </main>
        );
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
                return;
            }
            break;
    }

    return (
        <main>
            <div className="flex flex-col gap-8 p-2 py-12">
                <section>
                    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                        {session.role == "TEACHER" ? (
                            <div className="mb-5 flex flex-col items-center justify-between max-md:gap-3 md:flex-row">
                                <div className="flex items-center gap-4">
                                    <h1>Book Classes For Week {week}</h1>
                                </div>
                            </div>
                        ) : (
                            <BookingMenu
                                teacher={teacher.code}
                                teachers={allTeachers}
                                week={week}
                            />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Book;
