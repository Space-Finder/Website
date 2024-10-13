"use client";

import React from "react";
import Link from "next/link";
import { Teacher } from "@prisma/client";

import { getWeek } from "@lib/dates";
import TeacherPicker from "@components/teacherPicker";

const BookingMenu = ({
    week,
    teacher,
    teachers,
}: {
    week: number;
    teacher: string;
    teachers: Teacher[];
}) => {
    const today = new Date();
    const currentWeek = getWeek(today);

    return (
        <div className="mb-5 flex flex-col items-center justify-between max-md:gap-3 md:flex-row">
            <div className="flex items-center gap-4">
                <h1>Book Classes For Week {week}</h1>
            </div>
            <div className="flex items-center justify-center gap-5">
                <div>
                    <TeacherPicker teacher={teacher} teachers={teachers} />
                </div>
                <div className="flex items-center gap-2 rounded-lg p-1">
                    {week - 1 >= currentWeek + 1 && (
                        <Link
                            href={{
                                pathname: "/dashboard/book",
                                query: {
                                    week: Math.max(1, week - 1),
                                    teacher: teacher,
                                },
                            }}
                        >
                            {"<"}
                        </Link>
                    )}
                    <Link
                        href={{
                            pathname: "/dashboard/book",
                            query: {
                                week: currentWeek + 1,
                                teacher: teacher,
                            },
                        }}
                    >
                        Next Week
                    </Link>
                    <Link
                        href={{
                            pathname: "/dashboard/book",
                            query: {
                                week: Math.min(52, week + 1),
                                teacher: teacher,
                            },
                        }}
                    >
                        {">"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingMenu;
