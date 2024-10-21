"use client";
import { getDate } from "@lib/dates";

const Greeting = ({ color, name }: { color: string; name: string }) => {
    const hour = getDate().getHours();
    const greeting =
        "Good " +
        ((hour < 12 && "Morning") || (hour < 18 && "Afternoon") || "Evening");

    return (
        <h1 style={{ color }} className="drop-shadow-sm">
            {greeting}, {name.split(" ")[0]}
        </h1>
    );
};

export default Greeting;
