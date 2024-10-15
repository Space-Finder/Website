import { getISOWeek } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import periods from "./periods.json";
import teachers from "./teachers.json";

import { PrismaClient } from "@prisma/client";

export function getWeek(date?: Date): number {
    const timeZone = "Pacific/Auckland";

    if (!date) {
        date = new Date();
    }

    const d = toZonedTime(date, timeZone);
    return getISOWeek(d);
}

async function create_commons_and_spaces(prisma: PrismaClient) {
    const commons = [
        ["Papatuanuku", "#C12032", "#FFEFEF"],
        ["Pukeko", "#C12032", "#FFEFEF"],
        ["Pungawerewere", "#1576BB", "#EFF6FF"],
        ["Kahikatea", "#1576BB", "#EFF6FF"],
        ["Kea", "#BABB33", "#FFFBEF"],
        ["Mokoroa", "#BABB33", "#FFFBEF"],
        ["Waka", "#09A79E", "#EFFEFF"],
        ["Harakeke", "#09A79E", "#EFFEFF"],
    ];

    const spaces = [
        "Inner Common 1",
        "Inner Common 2",
        "Outer Common",
        "Pod",
        "Presentation",
    ];

    const specialSpaces = [
        "DVC Room",
        "Music Room",
        "Cafe",
        "Courtyard",
        "Media Studies Room",
        "Art Room",
        "Wet Lab",
        "Dry Lab",
        "AV Room",
        "Away on Trip",
        "Drama Room",
        "Careers/Gateway",
        "Theatre",
        "Gym",
        "Foodlab/Kitchen",
    ];

    for (const space of specialSpaces) {
        await prisma.space.create({
            data: {
                name: space,
            },
        });
    }

    for (const [name, primaryColor, secondaryColor] of commons) {
        const common = await prisma.common.create({
            data: {
                name,
                primaryColor,
                secondaryColor,
            },
        });

        for (const space of spaces) {
            await prisma.space.create({
                data: {
                    name: space,
                    commonId: common.id,
                },
            });
        }

        console.log(`Created data for ${common.name}`);
    }

    console.log("Completed Commons and Spaces!");
}

async function create_default_timetable(prisma: PrismaClient) {
    const weekTimetable = await prisma.weekTimetable.create({
        data: {
            name: "Default",
            default: true,
            monday: { create: { name: "Default Monday" } },
            tuesday: { create: { name: "Default Tuesday" } },
            wednesday: { create: { name: "Default Wednesday" } },
            thursday: { create: { name: "Default Thursday" } },
            friday: { create: { name: "Default Friday" } },
        },
    });

    await prisma.weekTimetable.create({
        data: {
            name: "Empty",
            monday: { create: { name: "Empty Monday" } },
            tuesday: { create: { name: "Empty Tuesday" } },
            wednesday: { create: { name: "Empty Wednesday" } },
            thursday: { create: { name: "Empty Thursday" } },
            friday: { create: { name: "Empty Friday" } },
        },
    });

    console.log("Creating Week Timetable...");

    for (let i = 0; i < periods.length; i++) {
        const days = [
            "mondayId",
            "tuesdayId",
            "wednesdayId",
            "thursdayId",
            "fridayId",
        ] as const;

        const dayTimetableId = weekTimetable[days[i]];

        const periodTypeMap = new Map([
            ["class", "CLASS"],
            ["break", "BREAK"],
            ["la", "LA"],
            ["custom", "CUSTOM"],
        ]);

        for (let period of periods[i]) {
            const periodType: any = periodTypeMap.get(
                period.periodType.toLowerCase(),
            );

            await prisma.period.create({
                data: {
                    startTime: period.startTime,
                    endTime: period.endTime,
                    periodNumber: period.periodNumber || 1,
                    periodType,
                    name: period.name || null,
                    line: period.line || null,
                    dayTimetables: {
                        connect: { id: dayTimetableId },
                    },
                },
            });
        }

        console.log(`${days[i].replace("Id", "")} Done!`);
    }

    const weekData = {
        number: getWeek(),
        year: new Date().getFullYear(),
        weekTimetable: {
            connect: { id: weekTimetable.id },
        },
    } as const;

    for (const y of ["Y11", "Y12", "Y13"] as const) {
        await prisma.week.create({
            data: {
                ...weekData,
                yearGroup: y,
            },
        });
        console.log(`Created ${y} week table`);
    }

    console.log("Set timetable as current");
}

async function create_teachers_and_courses(prisma: PrismaClient) {
    const commons_map = new Map<string, string>();
    const commons = await prisma.common.findMany();
    for (const common of commons) {
        commons_map.set(common.name.slice(0, 4).toUpperCase(), common.id);
    }

    console.log("Commons Map Made");

    for (const teacher_data of teachers) {
        const commonId = commons_map.get(teacher_data.common_code);
        if (!commonId) {
            continue;
        }

        const teacher = await prisma.teacher.create({
            data: {
                code: teacher_data.code,
                email: teacher_data.email,
                isCommonLeader: teacher_data.isCommonLeader,
                commonId,
            },
        });

        console.log("Doing", teacher_data.name);

        for (const course of teacher_data.courses) {
            const courseCommonId = commons_map.get(course.common_code);
            if (!courseCommonId) {
                continue;
            }
            await prisma.course.create({
                data: {
                    name: course.name,
                    code: course.code,
                    line: course.line,
                    teacherId: teacher.id,
                    commonId: courseCommonId,
                    year: course.year as "Y11" | "Y12" | "Y13",
                },
            });
        }
    }
    console.log("Done all teachers and classes");
}

async function bookings(prisma: PrismaClient) {
    const courses = await prisma.course.findMany();

    for (const course of courses) {
        const spaces = await prisma.space.findMany({
            where: { commonId: course.commonId },
            select: { id: true },
        });

        const week = await prisma.week.findFirst({
            where: { number: getWeek(), year: 2024, yearGroup: course.year },
        });

        if (!week) {
            continue;
        }

        const randomSpaceId =
            spaces[Math.floor(Math.random() * spaces.length)].id;

        for (const n of [1, 2, 3]) {
            await prisma.booking.create({
                data: {
                    courseId: course.id,
                    periodNumber: n,
                    spaceId: randomSpaceId,
                    weekId: week.id,
                    teacherId: course.teacherId,
                },
            });
        }
    }
}

async function main() {
    const prisma = new PrismaClient({});

    await create_commons_and_spaces(prisma);
    await create_teachers_and_courses(prisma);
    await create_default_timetable(prisma);
    await bookings(prisma);

    console.log("All Sample Data Created!");
}

main();
