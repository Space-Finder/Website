import React from "react";
import { redirect } from "next/navigation";

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

    return (
        <div className="flex">
            <DashboardSidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default DashboardLayout;
