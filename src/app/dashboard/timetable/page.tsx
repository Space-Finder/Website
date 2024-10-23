import React from "react";

import prisma from "@db/orm";
import { auth } from "@auth";
import { getEvents } from "@lib/events";
import { FiveOf } from "@core/types/timetable";
import TimetableMenu from "@components/timetable/menu";
import TimetableData from "@components/timetable/timetableData";
import {
    getWeek,
    getWeekDays,
    getDateFromWeek,
    getTermAndWeek,
    getDate,
} from "@lib/dates";

export const metadata = {
    title: "SpaceFinder | Timetable",
};

const Timetable = async ({
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

    // get list of date objects for each day of the week
    const week = Number(searchParams.week) || getWeek();
    const date = getDateFromWeek(week);

    const weekdays = getWeekDays(date);

    const allTeachers = await prisma.teacher.findMany({});

    const teacherCode = searchParams.teacher;
    const teacher = await prisma.teacher.findUnique({
        where: teacherCode
            ? { code: teacherCode.toUpperCase() }
            : { userId: session.id },
        include: { courses: { include: { common: true } }, common: true },
    });

    const termData = await getTermAndWeek(week, getDate().getFullYear());

    if (!teacher) {
        if (session.role !== "ADMIN") {
            return;
        }

        return (
            <main>
                <div className="flex flex-col gap-8 p-2 py-12">
                    <section>
                        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                            <TimetableMenu
                                teacher={""}
                                teachers={allTeachers}
                                week={week}
                                termData={termData}
                            />
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    const events = await getEvents(teacher, weekdays[0]);

    return (
        <main>
            <div className="flex flex-col gap-8 p-2 py-12">
                <section>
                    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
                        <TimetableMenu
                            teacher={teacher.code}
                            teachers={allTeachers}
                            week={week}
                            termData={termData}
                        />

                        <TimetableData
                            weekdays={weekdays as FiveOf<Date>}
                            events={events}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Timetable;
