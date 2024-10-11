import { Year } from "@prisma/client";

import prisma from "@db/orm";
import { getWeek } from "./dates";
import { HOURS_IN_DAY } from "@lib/consts";
import { WeekPeriods, FiveOf, TimetableEvent } from "@core/types/timetable";

// converts 24h to 12h time
export function formatTime(timeString: string) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
}

// get all the periods for the current week
export async function getTimetable(date?: Date): Promise<WeekPeriods> {
    if (!date) {
        date = new Date();
    }

    const weekNumber = getWeek(date);
    const currentYear = date.getFullYear();

    const week = await prisma.week.findFirst({
        where: { year: currentYear, number: weekNumber },
        include: { weekTimetable: weekIncludeQuery },
    });

    let timetable;
    if (week) {
        timetable = week.weekTimetable;
    } else {
        timetable = await prisma.weekTimetable.findUnique({
            where: { name: "Default" },
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
    const courses = new Map<number, (typeof teacher.courses)[0]>();
    for (const course of teacher.courses) {
        courses.set(course.line, course);
    }

    const timetablePeriods = await getTimetable();
    const events: TimetableEvent[][] = [];

    for (const day of timetablePeriods) {
        const dayEvents: TimetableEvent[] = [];

        for (const period of day) {
            const baseEvent = {
                startTime: period.startTime,
                endTime: period.endTime,
                locked: true,
            } as const;

            switch (period.periodType) {
                case "BREAK":
                    dayEvents.push({
                        ...baseEvent,
                        title: "Break",
                        description: null,
                        backgroundColor: "#fff7ed",
                        borderColor: "#ea580c",
                    });
                    break;

                case "CUSTOM":
                    dayEvents.push({
                        ...baseEvent,
                        title: period.name,
                        description: null,
                        backgroundColor: "##f0fdf4",
                        borderColor: "#16a34a",
                    });
                    break;

                case "LA":
                    dayEvents.push({
                        ...baseEvent,
                        title: period.name,
                        description: null,
                        backgroundColor: teacher.common.secondaryColor,
                        borderColor: teacher.common.primaryColor,
                    });
                    break;

                case "CLASS":
                    const course = courses.get(period.line);
                    const location = "Unset"; // TODO: NEED TO CONNECT TO BOOKINGS

                    if (course) {
                        dayEvents.push({
                            ...baseEvent,
                            title: `${course.name} - (${course.code})`,
                            description: `${location} (${course.common.name.slice(0, 4).toUpperCase()})`,
                            backgroundColor: course.common.secondaryColor,
                            borderColor: course.common.primaryColor,
                        });
                    }

                    break;
            }
        }

        events.push(dayEvents);
    }

    return events as FiveOf<TimetableEvent[]>;
}

// type needed for getEvents function
type Teacher = {
    courses: {
        common: {
            id: string;
            name: string;
            primaryColor: string;
            secondaryColor: string;
        };
        id: string;
        code: string;
        name: string;
        line: number;
        year: Year;
        teacherId: string;
        commonId: string;
    }[];
    common: {
        id: string;
        name: string;
        primaryColor: string;
        secondaryColor: string;
    };
    id: string;
    code: string;
    email: string;
    userId: string | null;
    commonId: string;
};

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
