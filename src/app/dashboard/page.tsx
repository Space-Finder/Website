import React from "react";
import Link from "next/link";

import { auth } from "@auth";
import prisma from "@db/orm";
import { getWeek } from "@lib/dates";
import Greeting from "@components/greeting";

export const metadata = {
    title: "SpaceFinder | Dashboard",
};

const Dashboard = async () => {
    const session = await auth();

    if (!session) {
        return;
    }

    const teacher = await prisma.teacher.findUnique({
        where: {
            userId: session.id,
        },
        include: {
            common: true,
            courses: true,
        },
    });

    if (!teacher) {
        return;
    }

    const { courses, common } = teacher;

    const commons = await prisma.common.findMany();

    const nextWeekNumber = getWeek() + 1;

    return (
        <div className="mt-10 space-y-8">
            <div className="mx-auto w-full text-center font-inter text-4xl font-bold">
                <Greeting color={common.primaryColor} name={session.name} />
            </div>

            <div className="mx-5 space-y-4">
                {courses.map((course) => {
                    const common = commons.find(
                        (co) => co.id === course.commonId,
                    );

                    return (
                        <div
                            key={course.id}
                            style={{
                                backgroundColor:
                                    common?.secondaryColor || "#fff",
                                borderColor: common?.primaryColor || "#000",
                            }}
                            className="flex items-center justify-between rounded-lg border-l-4 p-4 shadow-md transition duration-300 hover:shadow-lg"
                        >
                            <div className="flex-1">
                                <h6 className="mb-1 text-2xl font-semibold text-gray-900">
                                    {course.name} ({course.code})
                                </h6>
                                <p
                                    style={{
                                        color: common?.primaryColor || "#000",
                                    }}
                                    className="text-base font-medium text-gray-600"
                                >
                                    {common?.name} (Line: {course.line})
                                </p>
                            </div>

                            <div className="ml-4 flex space-x-2">
                                <Link
                                    href={`/dashboard/book?week=${nextWeekNumber}&courseId=${course.id}&teacherId=${teacher.id}`}
                                    className="rounded bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
                                >
                                    Book
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
