import { toZonedTime } from "date-fns-tz";
import { getISOWeek, setISOWeek, startOfISOWeek } from "date-fns";

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
