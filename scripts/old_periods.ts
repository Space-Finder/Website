export type Period = {
    start: string;
    end: string;
} & (
    | {
          type: "class";
          line: number;
          periodNumber: 1 | 2 | 3;
      }
    | { type: "break" }
    | { type: "custom"; name: string }
);

export const PERIODS = [
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
