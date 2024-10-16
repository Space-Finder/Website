import z from "zod";
import { keyBy } from "lodash";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@auth";
import prisma from "@db/orm";
import { getWeek } from "@lib/dates";

const QueryParametersValidator = z.object({
    periodNumber: z.preprocess((a) => parseInt(a as string), z.number()),
    line: z.preprocess((a) => parseInt(a as string), z.number()),
    commonId: z.string().cuid(),
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

    const { commonId, periodNumber, line } = validator.data;
    const weekNumber = validator.data.week || getWeek();

    const allSpaces = await prisma.space.findMany({
        where: { commonId },
    });
    const specialSpaces = await prisma.space.findMany({
        where: { commonId: null },
    });

    const bookings = keyBy(
        await prisma.booking.findMany({
            where: {
                periodNumber,
                course: {
                    line,
                    commonId,
                },
                week: {
                    number: weekNumber,
                },
            },
        }),
        "spaceId",
    );

    const availableSpaces = allSpaces.filter(
        (space) => !(space.id in bookings),
    );
    console.log(bookings, allSpaces);

    return NextResponse.json({
        availableSpaces,
        specialSpaces,
    });
}
