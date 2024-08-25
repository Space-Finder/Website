"use server";

import prisma from "@/core/db/orm";
import { redirect } from "next/navigation";

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
