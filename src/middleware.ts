import { NextResponse, NextRequest } from "next/server";

import AUTH_CONFIG from "@core/auth/config";
import { useServerSession } from "@core/auth/session";

export async function middleware(request: NextRequest) {
    const redirectURL = new URL(
        `/login?callbackUrl=${request.url}`,
        request.url,
    );

    const session = await useServerSession(AUTH_CONFIG);

    if (!session) {
        return NextResponse.redirect(redirectURL);
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
