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

export type Locations = (([string, string, string] | null)[] | null)[];
