import React from "react";
import { auth } from "@/core/lib/auth";

import prisma from "@/core/db/orm";
import BookingPage from "@/core/components/teachers/booking";
import { UnableToFetchTeacher } from "@/core/lib/error";

const Booking = async () => {
    const session = (await auth())!;

    const teacher = await prisma.teacher.findUnique({
        where: { userId: session.user.id },
        include: { user: true, classes: true, common: true },
    });

    if (!teacher) {
        throw new UnableToFetchTeacher(session.user.id);
    }

    return <BookingPage teacherId={teacher.id} />;
};

export default Booking;
