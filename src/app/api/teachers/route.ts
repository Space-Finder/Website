import z from "zod";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@auth";
import prisma from "@db/orm";

const BodyValidator = z.object({
    teacherCode: z.string().length(5),
    email: z.string().email(),
    commonId: z.string().cuid(),
    isCommonLeader: z.boolean().default(false),
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

    const { teacherCode, email, commonId, isCommonLeader } = validator.data;

    // check if teacher with code already exists
    const teacherAlreadyExists = await prisma.teacher.findUnique({
        where: { code: teacherCode },
    });
    if (teacherAlreadyExists) {
        return NextResponse.json(
            { detail: "Teacher already exists" },
            { status: 409 },
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

    const teacher = await prisma.teacher.create({
        data: {
            code: teacherCode,
            email,
            isCommonLeader,
            commonId,
        },
    });

    return NextResponse.json({ teacher });
}
