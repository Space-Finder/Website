import React from "react";
import { redirect } from "next/navigation";
import {
    faList,
    faCalendarCheck,
    faGear,
    faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { auth } from "@auth";
import DashboardSidebar from "@components/dashboard/sidebar";

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();

    if (!session) {
        return redirect("/login");
    }

    if (session.role !== "ADMIN") {
        return <>Unauthenticated</>;
    }

    const dashboardPages = [
        {
            // Where defaults can be set
            text: "Configuration",
            link: "/admin",
            icon: faGear,
        },
        {
            // creating timetables and structure
            text: "Timetable",
            link: "/admin/timetable",
            icon: faCalendarCheck,
        },
        {
            // Where classes are created
            text: "Classes",
            link: "/admin/courses",
            icon: faList,
        },
        {
            text: "Normal Dashboard",
            link: "/dashboard/",
            icon: faArrowRightFromBracket,
        },
    ];

    return (
        <div className="flex">
            <DashboardSidebar dashboardPages={dashboardPages} />
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default DashboardLayout;
