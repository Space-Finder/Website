import React from "react";

import { formatTime } from "@lib/times";
import { calculatePosition } from "@lib/times";
import { TimetableEventProps } from "@core/types/timetable";

// how long the period has to be (in min) for there to be space to show the time
const THRESHOLD_TO_SHOW_TIME = 30;

const TimetableEvent = (props: TimetableEventProps) => {
    const formattedStart = formatTime(props.startTime);
    const formattedEnd = formatTime(props.endTime);

    const durationString = `${formattedStart} - ${formattedEnd}`;

    const { duration, top, height } = calculatePosition(
        props.startTime,
        props.endTime,
        props.totalHeight,
    );

    const styles = {
        top: `${top}px`,
        height: `${height}px`,
        borderColor: props.borderColor,
        backgroundColor: props.backgroundColor,
    };

    const showTime = duration >= THRESHOLD_TO_SHOW_TIME;

    return (
        <div
            style={styles}
            className="absolute left-0 right-0 z-10 mx-[0.1rem] rounded border-l-2 bg-gray-50 p-1.5"
        >
            <p className="text-xs font-semibold">{props.title}</p>
            {props.description && (
                <p className="mb-px text-xs font-normal text-gray-900">
                    {props.description}
                </p>
            )}
            {showTime && (
                <p
                    style={{
                        color: props.borderColor,
                    }}
                    className="text-xs font-semibold"
                >
                    {durationString}
                </p>
            )}
        </div>
    );
};

export default TimetableEvent;
