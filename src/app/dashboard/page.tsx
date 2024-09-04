import React from "react";
import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";
import { formatTime } from "@/core/lib/time";
import { findNextPeriod } from "@/core/lib/periods";
import { UnableToFetchTeacher } from "@/core/lib/error";

const Dashboard = async () => {
    const session = (await auth())!;

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        include: { user: true, classes: true, common: true },
    });

    if (!teacher) {
        throw new UnableToFetchTeacher(session.user.id);
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
            <div className="mx-auto mb-10 w-full items-center text-center font-inter text-3xl font-bold">
                <h1
                    style={{ color: teacher.common.color || "#3b68da" }}
                    className="drop-shadow-sm"
                >
                    {greeting}, {session.user.name.split(" ")[0]}
                </h1>
            </div>
            <div>
                {classes.map((c, i) => {
                    const next = findNextPeriod(c.line)!;
                    const common = commons.find((co) => co.id === c.commonId)!;

                    return (
                        <div
                            style={{
                                backgroundColor: common.color2 || "#f3f4f6",
                                borderColor: common.color || "#4b5563",
                            }}
                            key={i}
                            className="m-2 rounded-xl border-l-2 p-2"
                        >
                            <h6 className="mb-1 text-xl font-semibold leading-8 text-black">
                                {c.name} ({c.code})
                            </h6>
                            <p
                                style={{
                                    color: common.color || "#4b5563",
                                }}
                                className="text-base font-normal text-gray-600"
                            >
                                {common.name} (Line: {c.line}), Next Class On:{" "}
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
