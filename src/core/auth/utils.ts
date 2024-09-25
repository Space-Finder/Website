import { SignJWT } from "jose";
import { addSeconds } from "date-fns";

import { AuthConfig, Session } from "@core/types";

export async function issueTokens(config: AuthConfig, userData: Session) {
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
