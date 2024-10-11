export type Period = {
    id: string;
    startTime: string;
    endTime: string;
} & (
    | {
          periodType: "CLASS";
          line: number;
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
