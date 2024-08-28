export type Period = {
    start: string;
    end: string;
} & (
    | {
          type: "class";
          line: number;
      }
    | { type: "break" }
    | { type: "custom"; name: string }
);
