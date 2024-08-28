import React from "react";
import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";

const Dashboard = async () => {
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

    const hour = new Date().getHours();
    const greeting =
        "Good " +
        ((hour < 12 && "Morning") || (hour < 18 && "Afternoon") || "Evening");

    const commons = await prisma.common.findMany();

    return (
        <div className="mt-10">
            <div className="mx-auto mb-10 w-full items-center text-center font-inter text-3xl font-bold text-[#3b68da]">
                <h1 className="drop-shadow-sm">
                    {greeting}, {s.user.name.split(" ")[0]}
                </h1>
            </div>
            <div>
                {classes.map((c, i) => (
                    <div key={i} className="m-2 rounded-xl bg-gray-100 p-2">
                        <h6 className="mb-1 text-xl font-semibold leading-8 text-black">
                            {c.name} ({c.code})
                        </h6>
                        <p className="text-base font-normal text-gray-600">
                            {
                                commons.filter((co) => co.id === c.commonId)[0]
                                    .name
                            }{" "}
                            (#{c.line})
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
