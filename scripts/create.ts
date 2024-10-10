import { PrismaClient } from "@prisma/client";

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

async function create_teachers(prisma: PrismaClient) {
    const pukeko = await prisma.common.findFirst({ where: { name: "Pukeko" } });
    const papatuanuku = await prisma.common.findFirst({
        where: { name: "Papatuanuku" },
    });

    if (!pukeko || !papatuanuku) {
        return console.log("Failed to create teachers as no common found");
    }

    await prisma.teacher.createMany({
        data: [
            {
                code: "PD",
                // email: "hprasad@ormiston.school.nz",
                email: "st22209@ormiston.school.nz",
                commonId: pukeko.id,
            },
            {
                code: "SP",
                email: "gsheppard@ormiston.school.nz",
                commonId: papatuanuku.id,
            },
        ],
    });

    console.log("Completed Teachers!");
}

async function create_courses(prisma: PrismaClient) {
    const pukeko = await prisma.common.findFirst({ where: { name: "Pukeko" } });
    const papatuanuku = await prisma.common.findFirst({
        where: { name: "Papatuanuku" },
    });
    const pungawerewere = await prisma.common.findFirst({
        where: { name: "Pungawerewere" },
    });

    if (!pukeko || !papatuanuku || !pungawerewere) {
        return console.log("Failed to create courses as no common found");
    }

    const pd = await prisma.teacher.findFirst({ where: { code: "PD" } });
    const sp = await prisma.teacher.findFirst({ where: { code: "SP" } });

    if (!pd || !sp) {
        return console.log("Failed to create courses as no teacher found");
    }

    await prisma.course.createMany({
        data: [
            {
                name: "Computer Science",
                code: "CSC3",
                line: 2,
                teacherId: pd.id,
                commonId: pukeko.id,
                year: "Y13",
            },
            {
                name: "Computer Science",
                code: "CSC3",
                line: 3,
                teacherId: pd.id,
                commonId: papatuanuku.id,
                year: "Y13",
            },
            {
                name: "Digital Programming",
                code: "DITP",
                line: 4,
                teacherId: pd.id,
                commonId: pungawerewere.id,
                year: "Y11",
            },
            {
                name: "Computer Science",
                code: "CSC2",
                line: 5,
                teacherId: pd.id,
                commonId: pukeko.id,
                year: "Y12",
            },
            {
                name: "Digital Technologies - Media",
                code: "DITM",
                line: 6,
                teacherId: pd.id,
                commonId: papatuanuku.id,
                year: "Y11",
            },
        ],
    });

    console.log("Created Mrs Prasad's Classes!");

    await prisma.course.createMany({
        data: [
            {
                name: "Computer Science",
                code: "CSC2",
                line: 1,
                teacherId: sp.id,
                commonId: pungawerewere.id,
                year: "Y12",
            },
            {
                name: "Digital Programming",
                code: "DITP",
                line: 2,
                teacherId: sp.id,
                commonId: papatuanuku.id,
                year: "Y11",
            },
            {
                name: "Digital Technologies - Media",
                code: "DITM",
                line: 4,
                teacherId: sp.id,
                commonId: pungawerewere.id,
                year: "Y11",
            },
            {
                name: "Computer Science",
                code: "CSC3",
                line: 5,
                teacherId: sp.id,
                commonId: pukeko.id,
                year: "Y13",
            },
        ],
    });

    console.log("Created Mr Sheppard's Classes!");
    console.log("All courses have been created!");
}

async function main() {
    const prisma = new PrismaClient({});

    await create_commons_and_spaces(prisma);
    await create_teachers(prisma);
    await create_courses(prisma);

    console.log("All Sample Data Created!");
}

main();
