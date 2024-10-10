import React from "react";
import { redirect } from "next/navigation";

import { auth } from "@auth";
import DashboardSidebar from "@components/dashboard/sidebar";
import StudentMessage from "@components/timetable/studentMessage";

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const user = await auth();

    if (!user) {
        return redirect("/login");
    }

    if (user.role === "STUDENT") {
        return <StudentMessage />;
    }

    return (
        <div className="flex">
            <DashboardSidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default DashboardLayout;
