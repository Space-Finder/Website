import z from "zod";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@auth";
import prisma from "@db/orm";
import { getWeek, getDate } from "@lib/dates";
import { Period } from "@core/types/timetable";

const QueryParametersValidator = z.object({
    teacherId: z.string().cuid(),
    courseId: z.string().cuid(),
    week: z.optional(
        z.preprocess(
            (a) => parseInt(a as string, 10),
            z.number().min(1).max(52),
        ),
    ),
});

export async function GET(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { detail: "You are not logged in!" },
            { status: 401 },
        );
    }

    if (session.role === "STUDENT") {
        return NextResponse.json(
            { detail: "You don't have permission to access this" },
            { status: 403 },
        );
    }

    const queryParameters = Object.fromEntries(request.nextUrl.searchParams);
    const validator = QueryParametersValidator.safeParse(queryParameters);

    if (!validator.success) {
        return NextResponse.json(
            { detail: "Bad request! You're missing some fields" },
            { status: 400 },
        );
    }

    const { teacherId, courseId } = validator.data;
    const weekNumber = validator.data.week || getWeek();

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
    });

    if (!course || !teacher) {
        return NextResponse.json(
            { detail: "Invalid Id Provided" },
            { status: 400 },
        );
    }

    if (session.role == "TEACHER") {
        const userExists = Boolean(
            await prisma.user.count({
                where: { id: teacher.userId || "" },
            }),
        );

        if (!userExists) {
            return NextResponse.json(
                {
                    detail: "You don't have permission to access another teachers bookings",
                },
                { status: 403 },
            );
        }
    }

    const currentYear = getDate().getFullYear();

    const week = await prisma.week.findFirst({
        where: {
            yearGroup: course.year,
            year: currentYear,
            number: weekNumber,
        },
        include: {
            weekTimetable: {
                include: {
                    monday: {
                        include: {
                            periods: true,
                        },
                    },
                    tuesday: {
                        include: {
                            periods: true,
                        },
                    },
                    wednesday: {
                        include: {
                            periods: true,
                        },
                    },
                    thursday: {
                        include: {
                            periods: true,
                        },
                    },
                    friday: {
                        include: {
                            periods: true,
                        },
                    },
                },
            },
        },
    });

    if (!week || !week.weekTimetable) {
        return NextResponse.json(
            {
                detail: "Week isn't set for some reason",
            },
            { status: 500 },
        );
    }

    const timetable = [
        week.weekTimetable.monday.periods,
        week.weekTimetable.tuesday.periods,
        week.weekTimetable.wednesday.periods,
        week.weekTimetable.thursday.periods,
        week.weekTimetable.friday.periods,
    ];

    const periods = timetable.flatMap((day) =>
        day.filter(
            (period) =>
                period.periodType === "CLASS" && period.line === course.line,
        ),
    ) as Extract<Period, { periodType: "CLASS" }>[];

    const bookingsExist = await Promise.all(
        periods.map(async (period) => {
            const booking = await prisma.booking.findFirst({
                where: {
                    weekId: week?.id,
                    courseId: course.id,
                    teacherId: teacher.id,
                    periodNumber: period.periodNumber,
                },
                include: {
                    space: true,
                    course: true,
                },
            });
            return booking;
        }),
    );

    const periodsBooked = periods.filter((_, index) => bookingsExist[index]);
    const periodsToBook = periods.filter((_, index) => !bookingsExist[index]);

    return NextResponse.json({
        periodsBooked,
        periodsToBook,
        bookingsMade: bookingsExist,
    });
}

const BodyValidator = z.object({
    periodNumber: z.number(),
    week: z.number().min(1).max(52),

    teacherId: z.string().cuid(),
    courseId: z.string().cuid(),
    spaceId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { detail: "You are not logged in!" },
            { status: 401 },
        );
    }

    if (session.role === "STUDENT") {
        return NextResponse.json(
            { detail: "You don't have permission to access this" },
            { status: 403 },
        );
    }

    const validator = BodyValidator.safeParse(await request.json());

    if (!validator.success) {
        return NextResponse.json(
            { detail: "Bad request! You're missing some fields" },
            { status: 400 },
        );
    }

    const {
        teacherId,
        courseId,
        spaceId,
        periodNumber,
        week: number,
    } = validator.data;

    const space = await prisma.space.findUnique({ where: { id: spaceId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
    });

    if (!course || !teacher || !space) {
        return NextResponse.json(
            { detail: "Invalid Id Provided" },
            { status: 400 },
        );
    }

    const week = await prisma.week.findFirst({
        where: {
            number,
            year: getDate().getFullYear(),
            yearGroup: course.year,
        },
    });

    if (!week) {
        return NextResponse.json(
            { detail: "Invalid Id Provided" },
            { status: 400 },
        );
    }

    if (session.role == "TEACHER") {
        const userExists = Boolean(
            await prisma.user.count({
                where: { id: teacher.userId || "" },
            }),
        );

        if (!userExists) {
            return NextResponse.json(
                {
                    detail: "You don't have permission to access another teachers bookings",
                },
                { status: 403 },
            );
        }
    }

    const bookingExists = await prisma.booking.findMany({
        where: {
            periodNumber,
            spaceId,
            week: {
                number: week.number,
            },
            course: {
                line: course.line,
                commonId: course.commonId,
            },
        },
    });

    if (bookingExists.length) {
        return NextResponse.json(
            {
                detail: "Booking conflict: This space is already booked for the specified period.",
            },
            { status: 409 },
        );
    }

    const booking = await prisma.booking.create({
        data: {
            periodNumber,
            spaceId,
            courseId,
            teacherId,
            weekId: week.id,
        },
    });

    return NextResponse.json({ booking });
}

const EditBodyValidator = z.object({
    periodNumber: z.number(),
    week: z.number().min(1).max(52),
    spaceId: z.string().cuid(),
    bookingId: z.string().cuid(),
});

export async function PATCH(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { detail: "You are not logged in!" },
            { status: 401 },
        );
    }

    if (session.role === "STUDENT") {
        return NextResponse.json(
            { detail: "You don't have permission to access this" },
            { status: 403 },
        );
    }

    const validator = EditBodyValidator.safeParse(await request.json());

    if (!validator.success) {
        return NextResponse.json(
            { detail: "Bad request! You're missing some fields" },
            { status: 400 },
        );
    }

    const { spaceId, periodNumber, bookingId, week: number } = validator.data;

    if (!bookingId) {
        return NextResponse.json(
            { detail: "Missing booking ID" },
            { status: 400 },
        );
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            course: true,
            teacher: true,
            space: true,
        },
    });

    if (!booking) {
        return NextResponse.json(
            { detail: "Booking not found!" },
            { status: 404 },
        );
    }

    // if they are a teacher they can only change their own booking
    if (booking.teacher.userId !== session.id && session.role === "TEACHER") {
        return NextResponse.json(
            { detail: "You can't do that" },
            { status: 403 },
        );
    }

    const space = await prisma.space.findUnique({ where: { id: spaceId } });

    if (!space) {
        return NextResponse.json(
            { detail: "Invalid Space ID provided!" },
            { status: 400 },
        );
    }

    const week = await prisma.week.findFirst({
        where: {
            number,
            year: getDate().getFullYear(),
            yearGroup: booking.course.year,
        },
    });

    if (!week) {
        return NextResponse.json(
            { detail: "Invalid week number!" },
            { status: 400 },
        );
    }

    const bookingConflict = await prisma.booking.findMany({
        where: {
            periodNumber,
            spaceId,
            week: {
                number: week.number,
            },
            course: {
                line: booking.course.line,
                commonId: booking.course.commonId,
            },
        },
    });

    if (bookingConflict.length) {
        return NextResponse.json(
            {
                detail: "Booking conflict: This space is already booked for the specified period.",
            },
            { status: 409 },
        );
    }

    console.log({
        where: { id: bookingId },
        data: {
            spaceId,
            periodNumber,
            weekId: week.id,
        },
    });

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            spaceId,
            periodNumber,
            weekId: week.id,
        },
    });

    return NextResponse.json({ updatedBooking });
}
