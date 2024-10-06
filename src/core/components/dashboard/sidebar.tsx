"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTicket,
    faList,
    faGear,
    faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

import { useSession } from "@core/auth/provider";

const DEFAULT_PROFILE_PICTURE =
    "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";

const DashboardSidebar = () => {
    const session = useSession();
    const pathname = usePathname();

    if (session.status !== "authenticated") {
        return;
    }

    const dashboardPages = [
        {
            text: "Classes",
            link: "/dashboard",
            icon: faList,
        },
        {
            text: "Timetable",
            link: "/dashboard/timetable",
            icon: faTicket,
        },
        {
            text: "Book",
            link: "/dashboard/book",
            icon: faCalendarCheck,
        },
        {
            text: "Settings",
            link: "/dashboard/settings",
            icon: faGear,
        },
    ];

    return (
        <aside className="flex h-screen w-64 flex-col overflow-y-auto border-r bg-white px-4 py-8 dark:border-gray-700 dark:bg-gray-900 rtl:border-l rtl:border-r-0">
            <div className="-mx-2 mt-6 flex flex-col items-center">
                <Image
                    className="mx-2 h-24 w-24 rounded-full object-cover"
                    src={session.data.image || DEFAULT_PROFILE_PICTURE}
                    width={96}
                    height={96}
                    unoptimized
                    alt="avatar"
                />
                <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">
                    {session.data.name}
                </h4>
                <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {session.data.email}
                </p>
            </div>

            <div className="mt-6 flex flex-1 flex-col justify-between">
                <nav>
                    {dashboardPages.map((page) => {
                        return (
                            <Link
                                key={page.text}
                                className={`mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 ${pathname == page.link ? "bg-gray-100" : ""}`}
                                href={page.link}
                            >
                                <FontAwesomeIcon icon={page.icon} />

                                <span className="mx-4 font-medium">
                                    {page.text}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
