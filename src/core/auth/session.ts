import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { AuthConfig } from "@core/types";
import { AccessTokenValidator } from "@lib/validators";

import { ServerSession } from "@core/types";
import axios from "axios";
import { decodeJwt } from "jose";

export async function useServerSession(
    config: AuthConfig,
): Promise<ServerSession> {
    const encoder = new TextEncoder();
    const accessToken = cookies().get("accessToken");

    if (!accessToken || !accessToken.value) {
        // even though access token doesnt exist, check if refresh token does
        const refreshToken = cookies().get("refreshToken");
        if (!refreshToken?.value) {
            return null;
        }

        try {
            // if it exists refresh the token and return the new session
            const response = await axios.post(
                `${config.authBaseURL}/refresh`,
                {},
                {
                    headers: {
                        Cookie: `refreshToken=${refreshToken.value}`,
                    },
                },
            );

            if (!response.data) {
                return null;
            }

            return decodeJwt(response.data.accessToken);
        } catch (error) {
            return null;
        }
    }

    // if access token does exist:

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
        role: data.role,
    };
}
