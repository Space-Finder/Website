export function getWeekDays(nextWeek: boolean = false): Date[] {
    const right_now = new Date();
    const date = nextWeek
        ? new Date(right_now.setDate(right_now.getDate() + 7))
        : right_now;

    const firstDayOfWeek = date.getDate() - date.getDay() + 1; // Monday
    const weekDays = [];

    for (let i = 0; i < 5; i++) {
        const currentDay = new Date(date.setDate(firstDayOfWeek + i));
        weekDays.push(currentDay);
    }

    // returns the dates in a week
    return weekDays;
}

// converts 24h to 12h time
export function formatTime(timeString: string) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
}
