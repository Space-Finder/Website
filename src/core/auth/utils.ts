import { SignJWT } from "jose";
import { addSeconds } from "date-fns";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { AuthConfig, Session } from "@core/types";

interface Tokens {
    accessToken: string;
    refreshToken: string;
    csrfToken: string;
}

export async function issueTokens(
    config: AuthConfig,
    userData: Session,
): Promise<Tokens> {
    const { id, name, email, image } = userData;

    const accessTokenData = {
        id,
        name,
        email,
        image,
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

    const csrfToken = await new SignJWT({ id })
        .setExpirationTime(
            addSeconds(time, config.token.accessTokenLifespan).getTime(),
        )
        .setIssuedAt()
        .setProtectedHeader({ alg })
        .sign(encoder.encode(config.secrets.csrfTokenSecret));

    const refreshToken = await new SignJWT({ id })
        .setExpirationTime(
            addSeconds(time, config.token.refreshTokenLifespan).getTime(),
        )
        .setIssuedAt()
        .setProtectedHeader({ alg })
        .sign(encoder.encode(config.secrets.refreshTokenSecret));

    return { accessToken, refreshToken, csrfToken };
}

export function setCookies(
    config: AuthConfig,
    cookieStore: ReadonlyRequestCookies,
    { accessToken, refreshToken, csrfToken }: Tokens,
) {
    const configValues = {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
    };

    cookieStore.set({
        name: "accessToken",
        value: accessToken,
        maxAge: config.token.accessTokenLifespan,
        ...configValues,
    });

    cookieStore.set({
        name: "csrfToken",
        value: csrfToken,
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
