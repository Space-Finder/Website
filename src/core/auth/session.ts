import axios from "axios";
import { cookies } from "next/headers";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

import {
    ACCESS_TOKEN_DEFAULT_LIFESPAN,
    REFRESH_TOKEN_DEFAULT_LIFESPAN,
} from "@lib/consts";
import { AuthConfig } from "@core/types";
import { Session } from "@core/types/auth";
import { AccessTokenValidator } from "@lib/validators";

type ServerSession = Session | null;

export async function serverSession(
    config: AuthConfig,
): Promise<ServerSession> {
    const accessToken = cookies().get("accessToken");
    const refreshToken = cookies().get("refreshToken");

    if (!accessToken || !accessToken.value) {
        return await refresh(config, refreshToken);
    }

    try {
        jwt.verify(accessToken.value, config.secrets.accessTokenSecret);
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return await refresh(config, refreshToken);
        }
        return null;
    }

    const parsedJWT = AccessTokenValidator.safeParse(
        jwt.decode(accessToken.value),
    );
    const tokenMalformed = parsedJWT.success === false;

    if (tokenMalformed) {
        return await refresh(config, refreshToken);
    }

    const { data } = parsedJWT;

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
    };
}

export async function refresh(
    config: AuthConfig,
    refreshToken: RequestCookie | undefined,
) {
    if (!refreshToken) {
        return null;
    }
    const response = await axios.post(
        `${config.authBaseURL}/refresh`,
        {
            refreshToken: refreshToken.value,
        },
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken.value}`,
            },
        },
    );

    if (!response.data.accessToken) {
        return null;
    }

    const parsedJWT = AccessTokenValidator.safeParse(
        jwt.decode(response.data.accessToken),
    );
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
    };
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

    return { accessToken, refreshToken };
}
