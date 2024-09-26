import { SignJWT } from "jose";
import { addSeconds } from "date-fns";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { AuthConfig, Tokens, TokenUserData } from "@core/types";

export async function issueTokens(
    config: AuthConfig,
    userData: TokenUserData,
): Promise<Tokens> {
    const { id, name, email, image, role } = userData;

    const accessTokenData = {
        id,
        name,
        email,
        image,
        role,
    };

    const encoder = new TextEncoder();
    const time = Date.now();
    const alg = "HS256";

    const accessToken = await new SignJWT(accessTokenData)
        .setExpirationTime(
            addSeconds(time, config.token.accessTokenLifespan).getTime(),
        )
        .setIssuedAt()
        .setProtectedHeader({ alg })
        .sign(encoder.encode(config.secrets.accessTokenSecret));

    const refreshToken = await new SignJWT({ id })
        .setExpirationTime(
            addSeconds(time, config.token.refreshTokenLifespan).getTime(),
        )
        .setIssuedAt()
        .setProtectedHeader({ alg })
        .sign(encoder.encode(config.secrets.refreshTokenSecret));

    return { accessToken, refreshToken };
}

export function setCookies(
    config: AuthConfig,
    cookieStore: ReadonlyRequestCookies,
    { accessToken, refreshToken }: Tokens,
) {
    const configValues = {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    } as const;

    cookieStore.set({
        name: "accessToken",
        value: accessToken,
        maxAge: config.token.accessTokenLifespan,
        ...configValues,
    });

    cookieStore.set({
        name: "refreshToken",
        value: refreshToken,
        maxAge: config.token.refreshTokenLifespan,
        ...configValues,
    });
}
