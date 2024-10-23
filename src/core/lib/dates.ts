import { toZonedTime } from "date-fns-tz";
import {
    getISOWeek,
    setISOWeek,
    startOfISOWeek,
    addDays,
    differenceInWeeks,
} from "date-fns";

import prisma from "@db/orm";
import { FiveOf } from "@core/types/timetable";

const TIME_ZONE = "Pacific/Auckland";

export function getDate() {
    const date = new Date(Date.now());
    return toZonedTime(date, TIME_ZONE);
}

export function getWeek(date?: Date): number {
    if (!date) {
        date = getDate();
    }

    return getISOWeek(date);
}

export function getDateFromWeek(weekNumber: number): Date {
    const date = getDate();
    const week = setISOWeek(date, weekNumber);

    return startOfISOWeek(week);
}

export function getWeekDays(date: Date): FiveOf<Date> {
    const monday = startOfISOWeek(date);

    return [0, 1, 2, 3, 4].map((offset) => {
        const day = addDays(monday, offset);
        return day;
    }) as FiveOf<Date>;
}

function getStartOfISOWeek(isoWeekNumber: number, year: number) {
    const january4th = new Date(Date.UTC(year, 0, 4)); // January 4th always in the first ISO week
    const startOfWeek = startOfISOWeek(january4th);

    return new Date(
        startOfWeek.setUTCDate(
            startOfWeek.getUTCDate() + (isoWeekNumber - 1) * 7,
        ),
    );
}

export async function getTermAndWeek(isoWeekNumber: number, year: number) {
    const isoWeekStartDate = getStartOfISOWeek(isoWeekNumber, year);
    const isoWeekStartDateInUTC = new Date(isoWeekStartDate.toISOString());

    const term = await prisma.term.findFirst({
        where: {
            startDate: {
                lte: isoWeekStartDateInUTC,
            },
            endDate: {
                gte: isoWeekStartDateInUTC,
            },
        },
    });

    if (term) {
        const termStartDateInNZ = toZonedTime(
            new Date(term.startDate),
            TIME_ZONE,
        );

        const weekOfTerm =
            differenceInWeeks(isoWeekStartDateInUTC, termStartDateInNZ) + 1;

        return {
            term: term.number,
            week: weekOfTerm,
        };
    }

    return null;
}
