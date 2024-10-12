export type Period = {
    startTime: string;
    endTime: string;
} & (
    | {
          periodType: "class";
          line: number;
          periodNumber: number;
      }
    | { periodType: "break" }
    | { periodType: "custom" | "LA"; name: string }
);

export const PERIODS = [
    [
        {
            startTime: "8:50",
            endTime: "10:20",
            periodType: "class",
            line: 1,
            periodNumber: 1,
        },
        { startTime: "10:20", endTime: "10:40", periodType: "break" },
        {
            startTime: "10:40",
            endTime: "11:40",
            periodType: "class",
            line: 2,
            periodNumber: 1,
        },
        {
            startTime: "11:40",
            endTime: "12:10",
            periodType: "LA",
            name: "LA",
        },
        { startTime: "12:10", endTime: "13:00", periodType: "break" },
        {
            startTime: "13:00",
            endTime: "14:00",
            periodType: "class",
            line: 3,
            periodNumber: 1,
        },
        {
            startTime: "14:00",
            endTime: "15:00",
            periodType: "class",
            line: 4,
            periodNumber: 1,
        },
    ],
    [
        {
            startTime: "8:50",
            endTime: "10:20",
            periodType: "class",
            line: 2,
            periodNumber: 2,
        },
        { startTime: "10:20", endTime: "10:40", periodType: "break" },
        {
            startTime: "10:40",
            endTime: "11:40",
            periodType: "class",
            line: 5,
            periodNumber: 1,
        },
        {
            startTime: "11:40",
            endTime: "12:40",
            periodType: "class",
            line: 6,
            periodNumber: 1,
        },
        { startTime: "12:40", endTime: "13:30", periodType: "break" },
        {
            startTime: "13:30",
            endTime: "14:30",
            periodType: "LA",
            name: "ITIME",
        },
        {
            startTime: "14:30",
            endTime: "15:30",
            periodType: "class",
            line: 1,
            periodNumber: 2,
        },
    ],
    [
        {
            startTime: "8:50",
            endTime: "10:20",
            periodType: "class",
            line: 6,
            periodNumber: 2,
        },
        { startTime: "10:20", endTime: "10:40", periodType: "break" },
        {
            startTime: "10:40",
            endTime: "12:10",
            periodType: "class",
            line: 4,
            periodNumber: 2,
        },
        { startTime: "12:10", endTime: "13:00", periodType: "break" },
        {
            startTime: "13:00",
            endTime: "14:00",
            periodType: "class",
            line: 5,
            periodNumber: 2,
        },
        {
            startTime: "14:00",
            endTime: "15:00",
            periodType: "class",
            line: 3,
            periodNumber: 2,
        },
    ],
    [
        {
            startTime: "10:10",
            endTime: "11:40",
            periodType: "class",
            line: 3,
            periodNumber: 3,
        },
        {
            startTime: "11:40",
            endTime: "12:40",
            periodType: "class",
            line: 1,
            periodNumber: 3,
        },
        { startTime: "12:40", endTime: "13:30", periodType: "break" },
        {
            startTime: "13:30",
            endTime: "14:30",
            periodType: "class",
            line: 2,
            periodNumber: 3,
        },
        {
            startTime: "14:30",
            endTime: "15:30",
            periodType: "custom",
            name: "TUTORIALS",
        },
    ],
    [
        {
            startTime: "8:50",
            endTime: "10:20",
            periodType: "class",
            line: 5,
            periodNumber: 3,
        },
        { startTime: "10:20", endTime: "10:40", periodType: "break" },
        {
            startTime: "10:40",
            endTime: "11:40",
            periodType: "class",
            line: 4,
            periodNumber: 3,
        },
        {
            startTime: "11:40",
            endTime: "12:40",
            periodType: "class",
            line: 6,
            periodNumber: 3,
        },
        { startTime: "12:40", endTime: "13:30", periodType: "break" },
        {
            startTime: "13:30",
            endTime: "14:00",
            periodType: "LA",
            name: "LA",
        },
        {
            startTime: "14:00",
            endTime: "15:00",
            periodType: "custom",
            name: "TUTORIALS",
        },
    ],
] satisfies Period[][];
