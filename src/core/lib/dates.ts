import { toZonedTime } from "date-fns-tz";
import { getISOWeek, setISOWeek, startOfISOWeek, addDays } from "date-fns";

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
