import { toZonedTime } from "date-fns-tz";
import { getISOWeek, setISOWeek, startOfISOWeek, addDays } from "date-fns";

import { FiveOf } from "@core/types/timetable";

const TIME_ZONE = "Pacific/Auckland";

export function getWeek(date?: Date): number {
    if (!date) {
        date = new Date();
    }

    const d = toZonedTime(date, TIME_ZONE);
    return getISOWeek(d);
}

export function getDateFromWeek(year: number, weekNumber: number): Date {
    let date = new Date(year, 0, 1); // January 1st of the given year
    date = setISOWeek(date, weekNumber);
    date = startOfISOWeek(date);

    return toZonedTime(date, TIME_ZONE);
}

export function getWeekDays(date: Date): FiveOf<Date> {
    const monday = startOfISOWeek(date);
    const mondayZoned = toZonedTime(monday, TIME_ZONE);

    // Generate dates for Monday to Friday
    return [0, 1, 2, 3, 4].map((offset) => {
        const day = addDays(mondayZoned, offset);
        return toZonedTime(day, TIME_ZONE); // Ensure it's in the correct time zone
    }) as FiveOf<Date>;
}
