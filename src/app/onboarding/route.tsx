import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

import prisma from "@db/orm";
import { auth } from "@core/auth";

export async function GET(request: NextRequest) {
    const user = await getUser();

    if (user.isOnboarded) {
        // if already onboarded
        return redirect("/dashboard");
    }

    const isTeacher = Boolean(
        await prisma.teacher.count({ where: { email: user.email } }),
    );

    if (isTeacher && !user.isTeacher) {
        // if they are a teacher AND their account hasn't already been setup
        await setupTeacherAccount(user.email);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { isOnboarded: true },
    });

    // refresh the current session as it still thinks the user is a student
    cookies().delete("accessToken");

    return redirect("/dashboard");
}
async function getUser() {
    const session = await auth();
    if (!session) {
        return redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.id,
        },
    });

    if (!user) {
        return redirect("/login");
    }

    return user;
}

async function setupTeacherAccount(email: string) {
    const user = await prisma.user.update({
        where: { email },
        data: { isTeacher: true, role: "TEACHER" },
    });

    // links the existing teacher record, to the new user's account
    await prisma.teacher.update({
        data: { userId: user.id },
        where: { email },
    });
}
