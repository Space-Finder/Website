import { getISOWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getWeek(date?: Date): number {
    const timeZone = "Pacific/Auckland";

    if (!date) {
        date = new Date();
    }

    const d = toZonedTime(date, timeZone);
    return getISOWeek(d);
}
