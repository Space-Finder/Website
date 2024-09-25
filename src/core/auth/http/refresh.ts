import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

import prisma from "@db/orm";
import { AuthConfig } from "@core/types";
import { issueTokens, setCookies } from "@core/auth/utils";

export default async function handleRefresh(config: AuthConfig) {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken || !refreshToken.value) {
        return NextResponse.json(
            { error: "Missing refresh token" },
            { status: 401 },
        );
    }

    const encoder = new TextEncoder();
    let decoded;
    try {
        decoded = await jwtVerify(
            refreshToken.value,
            encoder.encode(config.secrets.refreshTokenSecret),
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid refresh token" },
            { status: 403 },
        );
    }
    const { id } = decoded.payload as { id: string };
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tokens = await issueTokens(config, {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
    });

    const response = NextResponse.json(tokens);

    setCookies(config, cookieStore, tokens);

    return response;
}
