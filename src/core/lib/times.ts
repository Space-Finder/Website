import { groupBy } from "lodash";
import { Year } from "@prisma/client";

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
): Promise<FiveOf<TimetableEvent[]>> {
    const events: FiveOf<TimetableEvent[]> = [[], [], [], [], []];

    const groupedCourses = groupBy(teacher.courses, "year");
    const timetables = await getTimetables();
    for (const year in groupedCourses) {
        const timetablePeriods = timetables[year as Year];

        const courses = new Map<number, Course>();
        for (const course of groupedCourses[year]) {
            courses.set(course.line, course);
        }

        timetablePeriods.map((day, index) => {
            for (const period of day) {
                const event = convertToEvent(period, teacher, courses);
                if (event) {
                    events[index].push(event);
                }
            }
        });
    }

    return events as FiveOf<TimetableEvent[]>;
}

function convertToEvent(
    period: Period,
    teacher: Teacher,
    courses: Map<number, Course>,
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
            const location = "Unset"; // TODO: NEED TO CONNECT TO BOOKINGS

            if (course) {
                return {
                    ...baseEvent,
                    title: `${course.name} - (${course.code})`,
                    description: `${location} (${course.common.name.slice(0, 4).toUpperCase()})`,
                    backgroundColor: course.common.secondaryColor,
                    borderColor: course.common.primaryColor,
                };
            }
    }
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
