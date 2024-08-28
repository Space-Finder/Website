import React from "react";
import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";
import { formatTime } from "@/core/lib/time";
import { findNextPeriod } from "@/core/lib/periods";

const Dashboard = async () => {
    const s = (await auth())!;

    const teacher = await prisma.teacher.findUnique({
        where: { userId: s.user.id },
        include: { user: true, classes: true },
    });

    if (!teacher) {
        throw Error("teacher not found");
    }

    const { classes } = teacher;

    const hour = new Date().getHours();
    const greeting =
        "Good " +
        ((hour < 12 && "Morning") || (hour < 18 && "Afternoon") || "Evening");

    const commons = await prisma.common.findMany();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    return (
        <div className="mt-10">
            <div className="mx-auto mb-10 w-full items-center text-center font-inter text-3xl font-bold text-[#3b68da]">
                <h1 className="drop-shadow-sm">
                    {greeting}, {s.user.name.split(" ")[0]}
                </h1>
            </div>
            <div>
                {classes.map((c, i) => {
                    const next = findNextPeriod(c.line)!;
                    return (
                        <div key={i} className="m-2 rounded-xl bg-gray-100 p-2">
                            <h6 className="mb-1 text-xl font-semibold leading-8 text-black">
                                {c.name} ({c.code})
                            </h6>
                            <p className="text-base font-normal text-gray-600">
                                {
                                    commons.filter(
                                        (co) => co.id === c.commonId,
                                    )[0].name
                                }{" "}
                                (Line: {c.line}), Next Class On:{" "}
                                {days[next.dayIndex || 0]}{" "}
                                {formatTime(next.startTime)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
