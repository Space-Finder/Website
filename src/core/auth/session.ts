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
