import { google } from "googleapis";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import handleLogin from "./signIn";
import handleLogout from "./signOut";
import handleRefresh from "./refresh";
import { AuthConfig } from "@core/types";
import { useServerSession } from "../session";

const ROUTES = new Set(["session", "signIn", "signOut", "refresh"]);

export async function authRequestHandler(
    config: AuthConfig,
    request: NextRequest,
    params: { route: string[] },
) {
    const oauth2 = new google.auth.OAuth2({
        clientId: config.google.clientId,
        clientSecret: config.google.clientSecret,
        redirectUri: `${config.authBaseURL}/signIn`,
    });

    const route = params.route.join("/");
    if (!ROUTES.has(route)) {
        return redirect(config.errorURL);
    }

    const { searchParams } = new URL(request.url);

    if (request.method == "GET") {
        switch (route) {
            case "signIn":
                const code = searchParams.get("code");
                return await handleLogin(
                    config,
                    oauth2,
                    code,
                    searchParams.get("state"),
                );
            case "session":
                const session = await useServerSession(config);
                return NextResponse.json(session);
            case "signOut":
                // TODO: Fix redirecting issue
                return await handleLogout(config);
        }
    } else if (request.method == "POST") {
        switch (route) {
            case "refresh":
                return await handleRefresh(config);
        }
    }

    return redirect(config.errorURL);
}
