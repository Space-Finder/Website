import React from "react";
import { redirect } from "next/navigation";

import {
    faTicket,
    faList,
    faCalendarCheck,
    faLock,
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { auth } from "@auth";
import prisma from "@db/orm";
import DashboardSidebar from "@components/dashboard/sidebar";
import StudentMessage from "@components/timetable/studentMessage";

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();

    if (!session) {
        return redirect("/login");
    }

    if (session.role === "STUDENT") {
        const user = await prisma.user.findUnique({
            where: { id: session.id },
        });

        if (user?.isOnboarded) {
            return <StudentMessage />;
        }

        return redirect("/onboarding");
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
            icon: faCalendarCheck,
        },
        {
            text: "Book",
            link: "/dashboard/book",
            icon: faTicket,
        },
    ];

    if (session.role === "ADMIN") {
        dashboardPages.push({
            text: "Admin Dashboard",
            link: "/admin/",
            icon: faLock,
        });
    }

    return (
        <div className="flex">
            <DashboardSidebar dashboardPages={dashboardPages} />
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default DashboardLayout;
