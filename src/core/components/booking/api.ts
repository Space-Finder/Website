import axios from "axios";

export async function getBookings(
    courseId: string,
    teacherId: string,
    week: number,
) {
    const response = await axios.get(`/api/bookings`, {
        params: {
            courseId,
            teacherId,
            week,
        },
        withCredentials: true,
    });
    return response.data;
}

export async function getAvailableSpaces(
    periodNumber: number,
    line: number,
    commonId: string,
    week: number,
) {
    const response = await axios.get(`/api/spaces`, {
        params: {
            periodNumber,
            line,
            commonId,
            week,
        },
        withCredentials: true,
    });
    return response.data.availableSpaces;
}
