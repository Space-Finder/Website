export function getWeekDays(): Date[] {
    const date = new Date();
    const firstDayOfWeek = date.getDate() - date.getDay() + 1; // Monday
    const weekDays = [];

    for (let i = 0; i < 5; i++) {
        const currentDay = new Date(date.setDate(firstDayOfWeek + i));
        weekDays.push(currentDay);
    }

    return weekDays;
}

export function formatTime(timeString: string) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
}
