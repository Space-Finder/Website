import React from "react";

import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";
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

    const lineList = Array.from({ length: 6 }, (_, index) => {
        const line = index + 1;
        return classes.find((c) => c.line === line) || null;
    });

    const locations: Array<string[] | null> = [];

    return (
        <WeeklyTimetable
            lineList={lineList}
            teacherCommon={common.name}
            locations={locations}
        />
    );
};

export default TeacherTimetable;
