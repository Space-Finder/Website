import { redirect } from "next/navigation";

import prisma from "@/core/db/orm";
import { auth } from "@/core/lib/auth";
import { APIDown, APIRequestError } from "@/core/lib/error";

export default async function Onboarding() {
    const user = await getUser();

    if ((await isTeacher(user.email)) && !user.isTeacher) {
        await setupTeacherAccount(user.email);
    }

    if (!user.kamarPassword) {
        return redirect("/onboarding/getKamar");
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { isOnboarded: true },
    });

    return redirect("/dashboard");
}

async function isTeacher(email: string) {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/teachers/verify?${new URLSearchParams(
        {
            email,
        },
    )}`;

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new APIRequestError();
        }
        const data: {
            success: boolean;
            isTeacher: boolean;
        } = await response.json();

        return data.isTeacher;
    } catch (err) {
        console.log(err);
        throw new APIDown();
    }
}

async function getUser() {
    const session = await auth();

    if (!session || !session.user) {
        return await redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user?.email) {
        return await redirect("/login");
    }

    if (user.isOnboarded) {
        return await redirect("/dashboard");
    }

    return user;
}

async function setupTeacherAccount(email: string) {
    const user = await prisma.user.update({
        where: { email },
        data: { isTeacher: true },
    });

    await prisma.teacher.findUnique({
        where: { email },
    });

    await prisma.teacher.update({
        data: { userId: user.id },
        where: { email },
    });
}
