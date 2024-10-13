import { redirect } from "next/navigation";

import { AuthConfig } from "@core/types";
import { SCHOOL_DOMAIN, inDevelopmentMode } from "@lib/consts";

export async function login(config: AuthConfig, callbackURL?: string) {
    const scopes = ["openid", "profile", "email"];

    const urlParameters = new URLSearchParams({
        access_type: "offline",
        scope: scopes.join(" "),
        ...(!inDevelopmentMode && { hd: SCHOOL_DOMAIN }),
        response_type: "code",
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${config.authBaseURL}/signIn`,
        state: callbackURL || "",
    });

    const googleBaseURL = "https://accounts.google.com/o/oauth2/v2/auth?";
    const url = googleBaseURL + urlParameters.toString();

    await redirect(url);
}

export async function logout(config: AuthConfig) {
    redirect(`${config.authBaseURL}/signOut`);
}
