import { Auth, google } from "googleapis";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

import prisma from "@db/orm";
import { issueTokens } from "./session";
import { AuthConfig } from "@core/types";
import { SCHOOL_DOMAIN } from "@lib/consts";

const ROUTES = new Set(["csrf", "signOut", "session", "callback/google"]);

interface UserProfile {
    id: string;
    email?: string | null;
    verified_email?: boolean;
    name?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    picture?: string | null;
    hd?: string | null;
    [key: string]: any;
}

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

    if (request.method == "GET" && route == "callback/google") {
        const code = searchParams.get("code");
        return await handleLogin(
            config,
            oauth2,
            code,
            searchParams.get("state"),
        );
    }

    return redirect(config.errorURL);
}

async function handleLogin(
    config: AuthConfig,
    client: Auth.OAuth2Client,
    code: string | null,
    callbackURL: string | null,
) {
    if (!code) {
        return redirect(config.errorURL);
    }

    const { tokens } = await client.getToken(code);

    if (!tokens || !tokens.access_token) {
        return redirect(config.errorURL);
    }

    client.setCredentials(tokens);

    const userProfile = await client.request({
        url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    });

    if (userProfile.status !== 200) {
        return redirect(config.errorURL);
    }

    const { data } = userProfile as { data: UserProfile };
    const { id, name, email, picture } = data;

    if (!name || !email) {
        return redirect(config.errorURL);
    }

    if (!email.endsWith("@" + SCHOOL_DOMAIN)) {
        return redirect(config.errorURL);
    }

    const isNewUser = !Boolean(
        await prisma.user.count({
            where: { googleId: id },
        }),
    );

    const user = await prisma.user.upsert({
        where: { googleId: id },
        update: {
            email,
            name,
            image: picture,
        },
        create: {
            googleId: id,
            email: email,
            name: name,
            image: picture,
        },
    });

    issueTokens(config, {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
    });

    if (callbackURL) {
        return redirect(callbackURL);
    }

    if (isNewUser) {
        const redirectURL = config.pages?.newUser || "/";
        return redirect(redirectURL);
    }

    const redirectURL = config.pages?.signIn || "/";
    return redirect(redirectURL);
}
