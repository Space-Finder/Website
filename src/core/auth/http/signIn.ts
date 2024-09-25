import { Auth } from "googleapis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@db/orm";
import { AuthConfig } from "@core/types";
import { SCHOOL_DOMAIN } from "@lib/consts";
import { issueTokens, setCookies } from "@core/auth/utils";

export default async function handleLogin(
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

    // fetch user details from google
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

    // create new user or just update existing one
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

    const issuedTokens = await issueTokens(config, {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
    });

    setCookies(config, cookies(), issuedTokens);

    if (callbackURL) {
        return redirect(callbackURL);
    }

    if (isNewUser) {
        return redirect(config.pages.newUser);
    }

    return redirect(config.pages.signIn);
}

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