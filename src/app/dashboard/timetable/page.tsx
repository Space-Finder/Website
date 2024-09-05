import React from "react";

import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";
import { Locations } from "@/core/types/other";
import { numberOfLines } from "@/core/lib/periods";
import {
    UnableToFetchTeacher,
    APIRequestError,
    APIDown,
} from "@/core/lib/error";
import WeeklyTimetable from "@/core/components/teachers/weeklyTimetable";

const TeacherTimetable = async ({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) => {
    const session = (await auth())!;

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        include: { user: true, classes: true, common: true },
    });

    if (!teacher) {
        throw new UnableToFetchTeacher(session.user.id);
    }

    const { classes, common } = teacher;

    let week = await getWeek();
    let isNextWeek = false;
    if (searchParams !== undefined && searchParams["week"] === "next") {
        week += 1;
        isNextWeek = true;
    }

    const lineList = Array.from({ length: numberOfLines }, (_, index) => {
        const line = index + 1;
        return classes.find((c) => c.line === line) || null;
    });

    const bookings = await prisma.booking.findMany({
        where: { teacherId: teacher.id, week },
        include: { space: true, course: true },
    });

    const commons = await prisma.common.findMany();
    const common_names: Map<string, [string, string, string]> = new Map();
    for (const common of commons) {
        common_names.set(common.id, [common.name, common.color, common.color2]);
    }

    const locationList: Locations = Array.from(
        // run this loop for every line
        { length: numberOfLines },
        (_, index) => {
            const line = index + 1;
            const filteredBookings = bookings.filter(
                (b) => b.course.line == line,
            );

            // no bookings exist for the class
            if (filteredBookings.length == 0) {
                return null;
            }

            // the bookings for that week
            const result = [];

            // for every period (1, 2, 3)
            for (let periodNumber = 1; periodNumber < 4; periodNumber++) {
                // find the booking that corresponds to that period
                const booking = filteredBookings.find(
                    (b) => b.periodNumber == periodNumber,
                );
                if (booking) {
                    // if the booking is found add its location to the list
                    const location_data = [
                        booking.space.name,
                        ...common_names.get(booking.course.commonId)!,
                    ];
                    result.push(location_data as [string, string, string]);
                } else {
                    result.push(null);
                }
            }

            return result;
        },
    );

    return (
        <WeeklyTimetable
            lineList={lineList}
            teacherCommon={common}
            locations={locationList}
            isNextWeek={isNextWeek}
        />
    );
};

async function getWeek() {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/week`;
    let data: {
        success: boolean;
        week: number;
    };
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new APIRequestError();
        }
        data = await response.json();
    } catch (err) {
        throw new APIDown();
    }
    return data.week;
}

export default TeacherTimetable;
