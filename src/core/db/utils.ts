import { redirect } from "next/navigation";

import prisma from "@/core/db/orm";
import { User } from "@prisma/client";
import { auth } from "@/core/lib/auth";

export async function getUser(): Promise<User> {
    const session = await auth();

    if (!session || !session.user) {
        return await redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
        return await redirect("/login");
    }

    if (!user.isOnboarded) {
        return await redirect("/onboarding");
    }

    return user;
}
