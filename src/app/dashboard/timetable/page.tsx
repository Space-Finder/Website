import React from "react";

import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";
import WeeklyTimetable from "@/core/components/teachers/weeklyTimetable";

const TeacherTimetable = async () => {
    const s = (await auth())!;

    const teacher = await prisma.teacher.findUnique({
        where: { userId: s.user.id },
    });

    if (!teacher) {
        throw Error("teacher not found");
    }

    const classes = await prisma.course.findMany({
        where: { teacherId: teacher.id },
    });

    const lineList = [];
    for (let line = 1; line <= 6; line++) {
        const course = classes.filter((l) => l.line == line).at(0);
        lineList.push(course || null);
    }

    const common = await prisma.common.findUnique({
        where: { id: teacher.commonId },
    });

    const locations = [];

    return <WeeklyTimetable lineList={lineList} teacherCommon={common?.name!} />;
};

export default TeacherTimetable;
