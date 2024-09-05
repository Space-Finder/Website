"use server";

import { redirect } from "next/navigation";

import prisma from "@/core/db/orm";

// server actiont that runs on submit
export default async function handleSubmit(id: string, password: string) {
    await prisma.user.update({
        // will encrypt later
        data: { kamarPassword: password },
        where: { id },
    });

    await prisma.user.update({
        where: { id },
        data: { isOnboarded: true },
    });

    return await redirect("/dashboard");
}
