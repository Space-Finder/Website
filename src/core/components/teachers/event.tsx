import { Period } from "@/core/types/other";
import { Course, Common } from "@prisma/client";
import { formatTime } from "@/core/lib/time";

export const HOURS = 8;
type Locations = (string[][] | null)[];

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

        const formattedStart = formatTime(event.start);
        const formattedEnd = formatTime(event.end);
        const durationString = `${formattedStart} - ${formattedEnd}`;

        if (event.type == "break") {
            const showTime = !event.start.startsWith("10"); // because starts with 10 = morning tea, which is too small to include space to display the time

            return (
                <div
                    style={eventPositionCSS}
                    className="absolute left-0 right-0 z-10 mx-[0.1rem] rounded border-l-2 border-orange-600 bg-orange-50 p-1.5"
                >
                    <p className="text-xs font-semibold">Break</p>
                    {showTime && (
                        <p className="text-xs font-semibold text-orange-600">
                            {durationString}
                        </p>
                    )}
                </div>
            );
        }

        if (event.type == "custom") {
            const isLA = event.name === "LA"; // if LA theres no space to display full location
            const common = isLA
                ? teacherCommon.name.slice(0, 4).toUpperCase()
                : teacherCommon.name;
            const { color, color2 } = teacherCommon;

            return (
                <div
                    style={{
                        ...eventPositionCSS,
                        borderColor: color,
                        backgroundColor: color2,
                    }}
                    className="absolute left-0 right-0 z-10 mx-[0.1rem] rounded border-l-2 border-green-600 bg-green-50 p-1.5"
                >
                    <p className="text-xs font-semibold">{event.name}</p>
                    <p
                        style={{
                            color,
                        }}
                        className="mb-px text-xs font-bold"
                    >
                        {isLA ? (
                            `(${common}) `
                        ) : (
                            <>
                                {common} <br />
                            </>
                        )}
                        {durationString}
                    </p>
                </div>
            );
        }

        // as indexes start from 0
        const line = event.line - 1;
        const period = event.periodNumber - 1;

        const event_location_data = locations[line];
        const [location, common, primaryColor, secondaryColor] =
            event_location_data && event_location_data[period]
                ? event_location_data[period]
                : ["Unknown", "Unknown", "", ""]; // default location, common...

        const course = lineList[line] || { name: "Unknown", code: "UNKN" };

        return (
            <div
                style={{
                    ...eventPositionCSS,
                    borderColor: primaryColor,
                    backgroundColor: secondaryColor,
                }}
                className="absolute left-0 right-0 z-10 mx-[0.1rem] rounded border-l-2 border-blue-600 bg-blue-50 p-1.5"
            >
                <p className="text-xs font-semibold">
                    {course.name} - ({course.code})
                </p>
                <p className="mb-px text-xs font-normal text-gray-900">
                    {location} ({common!.slice(0, 4).toUpperCase()})
                </p>
                <p
                    style={{
                        color: primaryColor,
                    }}
                    className="text-xs font-semibold"
                >
                    {durationString}
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
