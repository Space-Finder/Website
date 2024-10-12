import { groupBy } from "lodash";
import { Year, Booking, Space } from "@prisma/client";

import prisma from "@db/orm";
import { getWeek } from "./dates";
import { HOURS_IN_DAY } from "@lib/consts";
import {
    WeekPeriods,
    FiveOf,
    TimetableEvent,
    Period,
    Course,
    Teacher,
} from "@core/types/timetable";

// converts 24h to 12h time
export function formatTime(timeString: string) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
}

// get all the periods for the current week
export async function getTimetable(
    yearGroup: Year,
    date?: Date,
): Promise<WeekPeriods> {
    if (!date) {
        date = new Date();
    }

    const weekNumber = getWeek(date);
    const currentYear = date.getFullYear();

    const week = await prisma.week.findFirst({
        where: { year: currentYear, number: weekNumber, yearGroup },
        include: { weekTimetable: weekIncludeQuery },
    });

    let timetable;
    if (week) {
        timetable = week.weekTimetable;
    } else {
        timetable = await prisma.weekTimetable.findFirst({
            where: { default: true },
            ...weekIncludeQuery,
        });
    }

    if (!timetable) {
        throw Error("Cannot Find Timetable");
    }

    return [
        timetable.monday.periods,
        timetable.tuesday.periods,
        timetable.wednesday.periods,
        timetable.thursday.periods,
        timetable.friday.periods,
    ] as WeekPeriods;
}

export async function getTimetables(date?: Date) {
    return {
        Y11: await getTimetable("Y11", date),
        Y12: await getTimetable("Y12", date),
        Y13: await getTimetable("Y13", date),
    };
}

// calculates where to position the indivisual timetable event
export function calculatePosition(
    start: string,
    end: string,
    totalHeight: number,
): { top: number; height: number; duration: number } {
    const MARGIN = 3;
    const HOURS = HOURS_IN_DAY - 1;

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const pixelsPerHour = totalHeight / HOURS;

    // Calculate start and end positions in pixels
    const startInHours = startHour + startMinute / 60 - HOURS;
    const endInHours = endHour + endMinute / 60 - HOURS;

    const topOffset = startInHours * pixelsPerHour;
    const endOffset = endInHours * pixelsPerHour;

    // Calculate height and ensure it doesn't go below zero
    const height = Math.max(endOffset - topOffset - MARGIN, 0);

    // duration of the period (in minutes)
    const duration = Math.round(60 * (endInHours - startInHours));

    return {
        top: pixelsPerHour + topOffset,
        height,
        duration,
    };
}

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

            const bookingKey = `${course.id}-${1}`;
            const booking = bookingsMap.get(bookingKey);

            // Determine the location based on the booking
            const location = booking?.space.name || "Not Booked Yet";

            return {
                ...baseEvent,
                title: `${course.name} - (${course.code})`,
                description: `${location} (${course.common.name.slice(0, 4).toUpperCase()})`,
                backgroundColor: course.common.secondaryColor,
                borderColor: course.common.primaryColor,
            };
    }
}

async function getWeekIdsForDate(
    date?: Date,
): Promise<{ Y11: string; Y12: string; Y13: string }> {
    if (!date) {
        date = new Date();
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

// for the prisma query in getTimetable, its pretty big so I put this at the bottom of file
const weekIncludeQuery = {
    include: {
        monday: {
            include: {
                periods: true,
            },
        },
        tuesday: {
            include: {
                periods: true,
            },
        },
        wednesday: {
            include: {
                periods: true,
            },
        },
        thursday: {
            include: {
                periods: true,
            },
        },
        friday: {
            include: {
                periods: true,
            },
        },
    },
} as const;
