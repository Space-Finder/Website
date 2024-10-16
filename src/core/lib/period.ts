import { getTimetable } from "./times";
import { Period } from "@core/types/timetable";

export function isTimeWithinPeriod(time: Date, period: Period): boolean {
    const startTimeParts = period.startTime.split(":");
    const endTimeParts = period.endTime.split(":");

    const start = new Date(time);
    start.setHours(
        parseInt(startTimeParts[0]),
        parseInt(startTimeParts[1]),
        0,
        0,
    );

    const end = new Date(time);
    end.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0, 0);

    return time >= start && time <= end;
}

export function getCurrentPeriod(
    date: Date,
    timetable: Awaited<ReturnType<typeof getTimetable>>,
): Period | null {
    const dayOfWeek = date.getDay();

    // timetable is only mon to fri only (1 to 5)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return null;
    }

    // Get the periods for the current day
    const periodsForDay = timetable[dayOfWeek - 1];

    for (const period of periodsForDay) {
        if (isTimeWithinPeriod(date, period)) {
            return period;
        }
    }

    // no match :(
    return null;
}
