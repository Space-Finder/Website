import React from "react";
import { auth } from "@/core/lib/auth";

import prisma from "@/core/db/orm";
import BookingPage from "@/core/components/teachers/booking";

const Booking = async () => {
    const session = (await auth())!;

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        include: { user: true, classes: true, common: true },
    });

    if (!teacher) {
        throw Error("Teacher Not Found");
    }

    return <BookingPage teacherId={teacher.id} />;
};

export default Booking;
