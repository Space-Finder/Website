import { Period } from "../types/other";

export const numberOfLines = 6;

export const PERIODS: Period[][] = [
    [
        {
            start: "8:50",
            end: "10:20",
            type: "class",
            line: 1,
            periodNumber: 1,
        },
        { start: "10:20", end: "10:40", type: "break" },
        {
            start: "10:40",
            end: "11:40",
            type: "class",
            line: 2,
            periodNumber: 1,
        },
        { start: "11:40", end: "12:10", type: "custom", name: "LA" },
        { start: "12:10", end: "13:00", type: "break" },
        {
            start: "13:00",
            end: "14:00",
            type: "class",
            line: 3,
            periodNumber: 1,
        },
        {
            start: "14:00",
            end: "15:00",
            type: "class",
            line: 4,
            periodNumber: 1,
        },
    ],
    [
        {
            start: "8:50",
            end: "10:20",
            type: "class",
            line: 2,
            periodNumber: 2,
        },
        { start: "10:20", end: "10:40", type: "break" },
        {
            start: "10:40",
            end: "11:40",
            type: "class",
            line: 5,
            periodNumber: 1,
        },
        {
            start: "11:40",
            end: "12:40",
            type: "class",
            line: 6,
            periodNumber: 1,
        },
        { start: "12:40", end: "13:30", type: "break" },
        { start: "13:30", end: "14:30", type: "custom", name: "ITIME" },
        {
            start: "14:30",
            end: "15:30",
            type: "class",
            line: 1,
            periodNumber: 2,
        },
    ],
    [
        {
            start: "8:50",
            end: "10:20",
            type: "class",
            line: 6,
            periodNumber: 2,
        },
        { start: "10:20", end: "10:40", type: "break" },
        {
            start: "10:40",
            end: "12:10",
            type: "class",
            line: 4,
            periodNumber: 2,
        },
        { start: "12:10", end: "13:00", type: "break" },
        {
            start: "13:00",
            end: "14:00",
            type: "class",
            line: 5,
            periodNumber: 2,
        },
        {
            start: "14:00",
            end: "15:00",
            type: "class",
            line: 3,
            periodNumber: 2,
        },
    ],
    [
        {
            start: "10:10",
            end: "11:40",
            type: "class",
            line: 3,
            periodNumber: 3,
        },
        {
            start: "11:40",
            end: "12:40",
            type: "class",
            line: 1,
            periodNumber: 3,
        },
        { start: "12:40", end: "13:30", type: "break" },
        {
            start: "13:30",
            end: "14:30",
            type: "class",
            line: 2,
            periodNumber: 3,
        },
        { start: "14:30", end: "15:30", type: "custom", name: "TUTORIALS" },
    ],
    [
        {
            start: "8:50",
            end: "10:20",
            type: "class",
            line: 5,
            periodNumber: 3,
        },
        { start: "10:20", end: "10:40", type: "break" },
        {
            start: "10:40",
            end: "11:40",
            type: "class",
            line: 4,
            periodNumber: 3,
        },
        {
            start: "11:40",
            end: "12:40",
            type: "class",
            line: 6,
            periodNumber: 3,
        },
        { start: "12:40", end: "13:30", type: "break" },
        { start: "13:30", end: "14:00", type: "custom", name: "LA" },
        { start: "14:00", end: "15:00", type: "custom", name: "TUTORIALS" },
    ],
];

export function findTime(
    line: number,
    period: number,
): { day: string; start: string; end: string } | null {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    for (let dayIndex = 0; dayIndex < PERIODS.length; dayIndex++) {
        const periods = PERIODS[dayIndex];

        for (let i = 0; i < periods.length; i++) {
            const currentPeriod = periods[i];

            // Check if the current period matches the line and periodNumber
            if (
                currentPeriod.type == "class" &&
                currentPeriod.line === line &&
                currentPeriod.periodNumber === period
            ) {
                return {
                    day: days[dayIndex],
                    start: currentPeriod.start,
                    end: currentPeriod.end,
                };
            }
        }
    }

    return null;
}

function parseTime(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

export function findNextPeriod(
    targetLine: number,
): { dayIndex: number; startTime: string } | null {
    const now = new Date();
    let currentDayIndex = now.getDay() - 1; // monday = 0, friday = 4

    // if its the weekend, use friday for next weeks calculations
    if (currentDayIndex < 0 || currentDayIndex > 4) {
        currentDayIndex = 4;
    }

    const currentTime = parseTime(`${now.getHours()}:${now.getMinutes()}`);

    const days = PERIODS.length;

    for (let i = 0; i < days; i++) {
        const dayIndex = (currentDayIndex + i) % days;
        const currentDay = PERIODS[dayIndex];

        for (const period of currentDay) {
            if (period.type === "class" && period.line === targetLine) {
                const periodStartTime = parseTime(period.start);
                if (i > 0 || periodStartTime > currentTime) {
                    return { dayIndex, startTime: period.start };
                }
            }
        }
    }

    return null;
}
