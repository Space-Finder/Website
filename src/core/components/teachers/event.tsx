import { Period } from "@/core/types/other";
import { Course, Common } from "@prisma/client";
import { formatTime } from "@/core/lib/time";

export const HOURS = 8;
type Locations = ((string)[][] | null)[];

export const createEventFactory = (
    locations: Locations,
    teacherCommon: Common,
    lineList: Array<Course | null>,
    totalHeight: number, // the height of the timetable
) => {
    const TimetableEvent = ({ event }: { event: Period }) => {
        const eventPositionCSS = eventLocationCSS(
            event.start,
            event.end,
            totalHeight,
        );

        if (event.type == "break") {
            return (
                <div
                    style={eventPositionCSS}
                    className="absolute left-0 right-0 z-10 mx-[0.1rem] rounded border-l-2 border-orange-600 bg-orange-50 p-1.5"
                >
                    <p className="text-xs font-semibold">Break</p>
                    {!event.start.startsWith("10") && (
                        <p className="text-xs font-semibold text-orange-600">
                            {formatTime(event.start)} - {formatTime(event.end)}
                        </p>
                    )}
                </div>
            );
        }

        if (event.type == "custom") {
            return (
                <div
                    style={{
                        ...eventPositionCSS,
                        borderColor: teacherCommon.color,
                        backgroundColor: teacherCommon.color2,
                    }}
                    className="absolute left-0 right-0 z-10 mx-[0.1rem] rounded border-l-2 border-green-600 bg-green-50 p-1.5"
                >
                    <p className="text-xs font-semibold">{event.name}</p>

                    {event.name !== "LA" ? (
                        <>
                            <p
                                style={{
                                    color: teacherCommon.color,
                                }}
                                className={`mb-px text-xs font-bold`}
                            >
                                {teacherCommon.name}
                            </p>
                            <p
                                style={{
                                    color: teacherCommon.color,
                                }}
                                className="text-xs font-semibold"
                            >
                                {formatTime(event.start)} -{" "}
                                {formatTime(event.end)}
                            </p>
                        </>
                    ) : (
                        <p
                            style={{
                                color: teacherCommon.color,
                            }}
                            className="text-xs font-semibold"
                        >
                            {formatTime(event.start)} - {formatTime(event.end)}{" "}
                            ({teacherCommon.name.slice(0, 4).toUpperCase()})
                        </p>
                    )}
                </div>
            );
        }

        const event_location_data = locations[event.line - 1];
        const [location, common, color, color2] =
            event_location_data && event_location_data[event.periodNumber - 1]
                ? event_location_data[event.periodNumber - 1]
                : ["Unset", "Unknown", "", ""];

        return (
            <div
                style={{
                    ...eventPositionCSS,
                    borderColor: color,
                    backgroundColor: color2,
                }}
                className={`absolute left-0 right-0 z-10 mx-[0.1rem] rounded border-l-2 bg-blue-50 p-1.5`}
            >
                <p className="text-xs font-semibold">
                    {lineList[event.line - 1]?.name} - (
                    {lineList[event.line - 1]?.code})
                </p>
                <p className="mb-px text-xs font-normal text-gray-900">
                    {location} ({common!.slice(0, 4).toUpperCase()})
                </p>
                <p
                    style={{
                        color: color || "#2563eb",
                    }}
                    className="text-xs font-semibold"
                >
                    {formatTime(event.start)} - {formatTime(event.end)}
                </p>
            </div>
        );
    };
    return TimetableEvent;
};

function eventLocationCSS(
    start: string,
    end: string,
    totalHeight: number,
): {
    top: string;
    height: string;
} {
    const MARGIN = 3;

    const [startHour, startMinute] = start.split(":");
    const [endHour, endMinute] = end.split(":");

    const pixels_per_hour = totalHeight / HOURS;

    const offset =
        (parseInt(startHour) + parseInt(startMinute) / 60 - HOURS) *
        pixels_per_hour;

    const endOffset =
        (parseInt(endHour) + parseInt(endMinute) / 60 - HOURS) *
        pixels_per_hour;

    const height = endOffset - offset - MARGIN;

    return {
        top: `${offset}px`,
        height: `${height}px`,
    };
}
