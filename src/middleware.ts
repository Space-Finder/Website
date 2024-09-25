import { decodeJwt, jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";

import { AccessTokenValidator } from "@lib/validators";

export async function middleware(request: NextRequest) {
    const redirectURL = NextResponse.redirect(
        new URL(`/login?callbackUrl=${request.url}`, request.url),
    );
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

    const accessToken = request.cookies.get("accessToken");
    if (!accessToken || !accessToken.value) {
        return redirectURL;
    }

    try {
        await jwtVerify(accessToken.value, secret);
    } catch (err) {
        return redirectURL;
    }

    const parsedJWT = AccessTokenValidator.safeParse(
        decodeJwt(accessToken.value),
    );

    const tokenMalformed = parsedJWT.success === false;
    if (tokenMalformed) {
        return redirectURL;
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
