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
        return (
            <section className="my-32">
                <div className="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-5">
                    <div className="flex flex-col items-center justify-end gap-6">
                        <h1 className="font-poppins text-3xl">SpaceFinder</h1>
                        <h2 className="font-manrope text-center text-5xl font-bold leading-normal text-black md:text-6xl">
                            Coming Soon...
                        </h2>
                        <p className="text-center text-base font-normal leading-relaxed text-black">
                            The student page is under construction, We are
                            almost done! <br /> For Inquiries Contact:{" "}
                            <a
                                href=""
                                className="hover:text-gray-500 hover:underline"
                            >
                                {" "}
                                st22209@ormiston.school.nz
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <div className="flex">
            <TeacherDashboardSidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default DashboardLayout;
