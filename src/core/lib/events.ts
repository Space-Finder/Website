import { groupBy } from "lodash";
import { Year, Booking, Space } from "@prisma/client";

import prisma from "@db/orm";
import { getWeek, getDate } from "./dates";
import { getTimetables } from "./times";
import {
    FiveOf,
    TimetableEvent,
    Period,
    Course,
    Teacher,
} from "@core/types/timetable";

export async function getEvents(
    teacher: Teacher,
    date?: Date,
): Promise<FiveOf<TimetableEvent[]>> {
    const events: FiveOf<TimetableEvent[]> = [[], [], [], [], []];

    const groupedCourses = groupBy(teacher.courses, "year");
    const timetables = await getTimetables(date);

    const weekIds = await getWeekIdsForDate(date);

    const bookings = await prisma.booking.findMany({
        where: {
            teacherId: teacher.id,
            weekId: { in: Object.values(weekIds) },
        },
        include: {
            space: true,
        },
    });

    // map of bookings indexed by courseId and periodNumber
    const bookingsMap = new Map(
        bookings.map((booking) => [
            `${booking.courseId}-${booking.periodNumber}`,
            booking,
        ]),
    );

    for (const year in groupedCourses) {
        const timetablePeriods = timetables[year as Year];
        const coursesMap = new Map<number, Course>(
            groupedCourses[year].map((course: Course) => [course.line, course]),
        );

        timetablePeriods.forEach((day, dayIndex) => {
            day.forEach((period) => {
                const event = convertToEvent(
                    period,
                    teacher,
                    coursesMap,
                    bookingsMap,
                    getWeek(date),
                );
                if (event) {
                    events[dayIndex].push(event);
                }
            });
        });
    }

    return events;
}

function convertToEvent(
    period: Period,
    teacher: Teacher,
    courses: Map<number, Course>,
    bookingsMap: Map<string, Booking & { space: Space }>,
    week: number,
): TimetableEvent | undefined {
    const baseEvent = {
        startTime: period.startTime,
        endTime: period.endTime,
        locked: true,
    } as const;

    switch (period.periodType) {
        case "BREAK":
            return {
                ...baseEvent,
                title: "Break",
                description: null,
                backgroundColor: "#fff7ed",
                borderColor: "#ea580c",
            };

        case "CUSTOM":
            return {
                ...baseEvent,
                title: period.name,
                description: null,
                backgroundColor: "##f0fdf4",
                borderColor: "#16a34a",
            };

        case "LA":
            return {
                ...baseEvent,
                title: period.name,
                description: null,
                backgroundColor: teacher.common.secondaryColor,
                borderColor: teacher.common.primaryColor,
            };

        case "CLASS":
            const course = courses.get(period.line);

            if (!course) {
                return;
            }

            const bookingKey = `${course.id}-${period.periodNumber}`;
            const booking = bookingsMap.get(bookingKey);

            // Determine the location based on the booking
            const location = booking?.space.name || "Not Booked Yet";

            // if the week is either the current, or before that, the bookings are locked
            const currentWeek = getWeek();
            if (week <= currentWeek) {
                return {
                    ...baseEvent,
                    title: `${course.name} - (${course.code})`,
                    description: `${location} (${course.common.name.slice(0, 4).toUpperCase()})`,
                    backgroundColor: course.common.secondaryColor,
                    borderColor: course.common.primaryColor,
                };
            }

            return {
                ...baseEvent,
                title: `${course.name} - (${course.code})`,
                description: `${location} (${course.common.name.slice(0, 4).toUpperCase()})`,
                backgroundColor: course.common.secondaryColor,
                borderColor: course.common.primaryColor,
                locked: false,
                booked: Boolean(booking),
                url: `/dashboard/book?week=${week}&courseId=${course.id}&teacher=${teacher.code}`,
            };
    }
}

async function getWeekIdsForDate(
    date?: Date,
): Promise<{ Y11: string; Y12: string; Y13: string }> {
    if (!date) {
        date = getDate();
    }

    const year = date.getFullYear();
    const weekNumber = getWeek(date);

    const weekY11 = await prisma.week.findFirst({
        where: {
            year,
            number: weekNumber,
            yearGroup: "Y11",
        },
    });

    const weekY12 = await prisma.week.findFirst({
        where: {
            year,
            number: weekNumber,
            yearGroup: "Y12",
        },
    });

    const weekY13 = await prisma.week.findFirst({
        where: {
            year,
            number: weekNumber,
            yearGroup: "Y13",
        },
    });

    return {
        Y11: weekY11?.id || "",
        Y12: weekY12?.id || "",
        Y13: weekY13?.id || "",
    };
}
