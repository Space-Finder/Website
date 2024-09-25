import { google } from "googleapis";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { AuthConfig } from "@core/types";

import handleLogin from "./signIn";
import handleLogout from "./signOut";

const ROUTES = new Set([
    "csrf",
    "session",
    "callback/google", // TODO:rename later to signIn once google allows
    "signOut",
    "refresh",
]);

export async function authRequestHandler(
    config: AuthConfig,
    request: NextRequest,
    params: { route: string[] },
) {
    const oauth2 = new google.auth.OAuth2({
        clientId: config.google.clientId,
        clientSecret: config.google.clientSecret,
        redirectUri: `${config.authBaseURL}/callback/google`,
    });

    const route = params.route.join("/");
    if (!ROUTES.has(route)) {
        return redirect(config.errorURL);
    }

    const { searchParams } = new URL(request.url);

    console.log(request.method);
    if (request.method == "GET") {
        switch (route) {
            case "callback/google": // TODO: rename later to signIn once google allows
                const code = searchParams.get("code");
                return await handleLogin(
                    config,
                    oauth2,
                    code,
                    searchParams.get("state"),
                );
            case "csrf":
                break;
            case "session":
                break;
            case "signOut":
                // TODO: Fix redirecting issue
                return await handleLogout(config);
        }
    } else if (request.method == "POST") {
        switch (route) {
            case "refresh":
                //     const data = await request.json();
                //     return await handleRefresh(config);
                break;
        }
    }

    return redirect(config.errorURL);
}
