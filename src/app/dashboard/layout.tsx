import React from "react";

import { getUser } from "@/core/db/utils";
import TeacherDashboardSidebar from "@/core/components/teacherSidebar";

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const user = await getUser();
    if (!user.isTeacher) {
        return <>Student Page In Development</>;
    }

    return (
        <div className="flex">
            <TeacherDashboardSidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default DashboardLayout;
