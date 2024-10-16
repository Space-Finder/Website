import { Year } from "@prisma/client";

export type Period = {
    id: string;
    startTime: string;
    endTime: string;
} & (
    | {
          periodType: "CLASS";
          line: number;
          periodNumber: number;
      }
    | { periodType: "BREAK" }
    | { periodType: "CUSTOM" | "LA"; name: string }
);

export type FiveOf<T> = [T, T, T, T, T];

export type WeekPeriods = FiveOf<Period[]>;

export type TimetableEvent = {
    title: string | React.JSX.Element;
    description: string | React.JSX.Element | null;
    borderColor: string;
    backgroundColor: string;
    startTime: string;
    endTime: string;
} & (
    | {
          locked: true;
      }
    | {
          locked: false;
          booked: boolean;
          url: string;
      }
);

export type TimetableEventProps = { totalHeight: number } & TimetableEvent;

export type Course = Teacher["courses"][0];

// type needed for getEvents function
export type Teacher = {
    courses: {
        common: {
            id: string;
            name: string;
            primaryColor: string;
            secondaryColor: string;
        };
        id: string;
        code: string;
        name: string;
        line: number;
        year: Year;
        teacherId: string;
        commonId: string;
    }[];
    common: {
        id: string;
        name: string;
        primaryColor: string;
        secondaryColor: string;
    };
    id: string;
    code: string;
    email: string;
    userId: string | null;
    commonId: string;
};
