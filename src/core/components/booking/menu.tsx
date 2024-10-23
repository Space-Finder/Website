"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "@hooks/session";
import { Teacher, Course } from "@prisma/client";

import { getWeek, getDate } from "@lib/dates";
import TeacherPicker from "@components/teacherPicker";
import CoursePicker from "@components/classPicker";

const BookingMenu = ({
    week,
    teacher,
    teachers,
    course,
    courses,
    termData,
}: {
    week: number;
    teacher: string;
    teachers: Teacher[];
    course: Course | null;
    courses: Course[];
    termData: {
        term: number;
        week: number;
    } | null;
}) => {
    const today = getDate();
    const session = useSession();
    const currentWeek = getWeek(today);

    const pathname = "/dashboard/book";

    return (
        <div>
            <div className="mb-5 flex flex-col items-center justify-between max-md:gap-3 md:flex-row">
                <div className="font-inter text-2xl font-bold text-gray-800">
                    <h1>
                        Book Classes For:{" "}
                        {termData
                            ? `Term ${termData.term} Week ${termData.week}`
                            : `Week ${week}`}
                    </h1>
                </div>
                {session.data?.role !== "TEACHER" && (
                    <div className="flex items-center justify-center gap-5">
                        <div>
                            <TeacherPicker
                                teacher={teacher}
                                teachers={teachers}
                            />
                        </div>
                        <div className="flex items-center gap-2 rounded-lg p-1">
                            {week - 1 >= currentWeek + 1 && (
                                <Link
                                    href={{
                                        pathname,
                                        query: {
                                            week: Math.max(1, week - 1),
                                            teacher,
                                        },
                                    }}
                                >
                                    {"<"}
                                </Link>
                            )}
                            <Link
                                href={{
                                    pathname,
                                    query: {
                                        week: currentWeek + 1,
                                        teacher,
                                    },
                                }}
                            >
                                Next Week
                            </Link>
                            <Link
                                href={{
                                    pathname,
                                    query: {
                                        week: Math.min(52, week + 1),
                                        teacher,
                                    },
                                }}
                            >
                                {">"}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <CoursePicker course={course} courses={courses} />
        </div>
    );
};

export default BookingMenu;
