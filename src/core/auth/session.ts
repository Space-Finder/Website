import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { AuthConfig } from "@core/types";
import { Session } from "@core/types/auth";
import { AccessTokenValidator } from "@lib/validators";

type ServerSession = Session | null;

export async function useServerSession(
    config: AuthConfig,
): Promise<ServerSession> {
    const encoder = new TextEncoder();
    const accessToken = cookies().get("accessToken");

    if (!accessToken || !accessToken.value) {
        return null;
    }

    let decoded;
    try {
        decoded = await jwtVerify(
            accessToken.value,
            encoder.encode(config.secrets.accessTokenSecret),
        );
    } catch (err) {
        return null;
    }

    const parsedJWT = AccessTokenValidator.safeParse(decoded.payload);
    const tokenMalformed = parsedJWT.success === false;

    if (tokenMalformed) {
        return null;
    }

    const { data } = parsedJWT;

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        expiresAt: data.exp,
    };
}
