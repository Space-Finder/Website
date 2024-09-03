import React from "react";

import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";
import { Locations } from "@/core/types/other";
import { numberOfLines } from "@/core/lib/periods";
import { APIRequestIssue } from "@/core/lib/error";
import WeeklyTimetable from "@/core/components/teachers/weeklyTimetable";

const TeacherTimetable = async () => {
    const session = (await auth())!;

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        include: { user: true, classes: true, common: true },
    });

    if (!teacher) {
        throw Error("Teacher Not Found");
    }

    const { classes, common } = teacher;

    const lineList = Array.from({ length: numberOfLines }, (_, index) => {
        const line = index + 1;
        return classes.find((c) => c.line === line) || null;
    });

    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/week`;
    let data: {
        success: boolean;
        week: number;
    };
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new APIRequestIssue(null);
        }
        data = await response.json();
    } catch (err) {
        throw new APIRequestIssue(err);
    }

    const bookings = await prisma.booking.findMany({
        where: { teacherId: teacher.id, week: data.week },
        include: { space: true, course: true },
    });

    const commons = await prisma.common.findMany();
    const common_names: Map<string, [string, string, string]> = new Map();
    for (const common of commons) {
        common_names.set(common.id, [common.name, common.color, common.color2]);
    }

    const locationList: Locations = Array.from({ length: 6 }, (_, index) => {
        const line = index + 1;
        const filteredBookings = bookings.filter((b) => b.course.line == line);
        if (filteredBookings.length == 0) {
            return null;
        }
        return filteredBookings.map((booking) => [
            booking.space.name,
            ...common_names.get(booking.course.commonId)!,
        ]);
    });

    return (
        <WeeklyTimetable
            lineList={lineList}
            teacherCommon={common}
            locations={locationList}
        />
    );
};

export default TeacherTimetable;
