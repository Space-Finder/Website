"use client";

import React, { useRef, useEffect, useState } from "react";

import { formatTime } from "@lib/times";
import { HOURS_IN_DAY, START_HOUR } from "@lib/consts";
import TimetableEvent from "@components/timetable/event";
import {
    TimetableEvent as TimetableEventT,
    FiveOf,
} from "@core/types/timetable";

const TIME_SLOTS = Array.from(
    { length: HOURS_IN_DAY },
    (_, i) => `${START_HOUR + i}:00`,
);

const TimetableData = (props: {
    weekdays: FiveOf<Date>;
    events: FiveOf<TimetableEventT[]>;
}) => {
    const today = new Date();

    const timeSlotsContainerRef = useRef<HTMLDivElement>(null);
    const [timeSlotsHeight, setTimeSlotsHeight] = useState<number>(0); // height of timetable

    useEffect(() => {
        if (!timeSlotsContainerRef.current) {
            return;
        }

        // calculates the height when the page loads
        const height = timeSlotsContainerRef.current.offsetHeight;
        setTimeSlotsHeight(height - Math.ceil(height / HOURS_IN_DAY));
    }, []);

    return (
        <div>
            <div className="grid h-full w-full grid-cols-[0.4fr_1fr_1fr_1fr_1fr_1fr] border-t border-gray-200">
                <div></div>

                {/* render each day of the week */}
                {props.weekdays.map((day, idx) => {
                    const isToday = today.getTime() === day.getTime();
                    const dayColor = isToday
                        ? "font-extrabold text-indigo-600"
                        : "text-gray-900";

                    const dayFormatted = day.toLocaleDateString("en-NZ", {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    });

                    return (
                        <React.Fragment key={day.getTime()}>
                            <div className="relative flex items-center justify-center p-3.5">
                                <h1
                                    className={`text-sm font-medium ${dayColor}`}
                                >
                                    {dayFormatted}
                                </h1>

                                {/* render all events for that day */}
                                {props.events[idx].map((event) => (
                                    <TimetableEvent
                                        {...event}
                                        totalHeight={timeSlotsHeight}
                                    />
                                ))}
                            </div>
                        </React.Fragment>
                    );
                })}

                {/* times on the left */}
                <div
                    ref={timeSlotsContainerRef}
                    className="grid grid-rows-[repeat(9,1fr)] border-t border-gray-200"
                >
                    {TIME_SLOTS.map((time, timeIdx) => (
                        <div
                            key={timeIdx}
                            className="flex w-full justify-center py-10 text-center text-sm font-medium text-gray-900"
                        >
                            {formatTime(time)}
                        </div>
                    ))}
                </div>

                {/* background grid */}
                {props.weekdays.map((_, idx) => (
                    <div
                        key={idx}
                        className="grid grid-rows-[repeat(9,1fr)] border-t border-gray-200"
                    >
                        {TIME_SLOTS.map((_, timeIdx) => (
                            <div
                                key={timeIdx}
                                className="translate-y-[50%] border-t border-gray-200"
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimetableData;
