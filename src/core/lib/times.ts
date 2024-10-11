import prisma from "@db/orm";
import { getWeek } from "./dates";
import { HOURS_IN_DAY } from "@lib/consts";
import { WeekPeriods } from "@core/types/timetable";

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
    ];
}

// calculates where to position the indivisual timetable event
export function calculatePosition(
    start: string,
    end: string,
    totalHeight: number,
): { top: string; height: string } {
    const MARGIN = 3;

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const pixelsPerHour = totalHeight / HOURS_IN_DAY;

    // Calculate start and end positions in pixels
    const startInHours = startHour + startMinute / 60;
    const endInHours = endHour + endMinute / 60;

    const topOffset = startInHours * pixelsPerHour;
    const endOffset = endInHours * pixelsPerHour;

    // Calculate height and ensure it doesn't go below zero
    const height = Math.max(endOffset - topOffset - MARGIN, 0);

    return {
        top: `${topOffset}px`,
        height: `${height}px`,
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
