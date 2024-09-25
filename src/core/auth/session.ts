import { cookies } from "next/headers";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

import {
    ACCESS_TOKEN_DEFAULT_LIFESPAN,
    REFRESH_TOKEN_DEFAULT_LIFESPAN,
} from "@lib/consts";
import { AuthConfig } from "@core/types";
import { Session } from "@core/types/auth";
import { AccessTokenValidator } from "@lib/validators";

export async function serverSession(
    config: AuthConfig,
): Promise<Session | null> {
    const accessToken = cookies().get("accessToken");
    const refreshToken = cookies().get("accessToken");

    if (!accessToken || !accessToken.value) {
        return refresh(config, refreshToken);
    }

    try {
        jwt.verify(accessToken.value, config.secrets.accessTokenSecret);
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return refresh(config, refreshToken);
        }
        return null;
    }

    const parsedJWT = AccessTokenValidator.safeParse(
        jwt.decode(accessToken.value),
    );
    const tokenMalformed = parsedJWT.success === false;

    if (tokenMalformed) {
        return refresh(config, refreshToken);
    }

    const { data } = parsedJWT;

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
    };
}

export function refresh(
    config: AuthConfig,
    refreshToken: RequestCookie | undefined,
) {
    return null;
}

export function issueTokens(config: AuthConfig, userData: Session) {
    const { id, name, email, image } = userData;

    const accessTokenLifespan =
        config.token?.accessTokenLifespan || ACCESS_TOKEN_DEFAULT_LIFESPAN;
    const refreshTokenLifespan =
        config.token?.refreshTokenLifespan || REFRESH_TOKEN_DEFAULT_LIFESPAN;

    const accessTokenData = {
        id,
        name,
        email,
        image,
    };

    const accessToken = jwt.sign(
        accessTokenData,
        config.secrets.accessTokenSecret,
        { expiresIn: accessTokenLifespan },
    );

    const refreshToken = jwt.sign({ id }, config.secrets.refreshTokenSecret, {
        expiresIn: refreshTokenLifespan,
    });

    cookies().set({
        name: "accessToken",
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: accessTokenLifespan,
    });

    cookies().set({
        name: "refreshToken",
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: refreshTokenLifespan,
    });

    return { accessToken, refreshToken };
}
