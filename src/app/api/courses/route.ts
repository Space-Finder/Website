import z from "zod";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@auth";
import prisma from "@db/orm";

const BodyValidator = z.object({
    code: z.string(),
    name: z.string(),
    year: z.enum(["Y11", "Y12", "Y13"]),
    line: z.number(),

    teacherId: z.string().cuid(),
    commonId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { detail: "You are not logged in!" },
            { status: 401 },
        );
    }

    if (session.role !== "ADMIN") {
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

    const { code, name, line, year, teacherId, commonId } = validator.data;

    // check if teacher with id exists
    const teacherExists = await prisma.teacher.findUnique({
        where: { id: teacherId },
    });
    if (!teacherExists) {
        return NextResponse.json(
            { detail: "Teacher does not exist" },
            { status: 400 },
        );
    }

    // check if common exists
    const common = await prisma.common.findUnique({ where: { id: commonId } });
    if (!common) {
        return NextResponse.json(
            { detail: "Common does not exist" },
            { status: 400 },
        );
    }

    // check no conflicting line
    const alreadyExistingCourse = await prisma.course.findFirst({
        where: {
            line,
            teacherId,
        },
    });
    if (alreadyExistingCourse) {
        return NextResponse.json(
            { detail: "You already have a class at this time" },
            { status: 400 },
        );
    }

    const course = await prisma.course.create({
        data: {
            name,
            code,
            year,
            line,
            teacherId,
            commonId,
        },
    });

    return NextResponse.json({ course });
}
