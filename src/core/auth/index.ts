import { NextRequest } from "next/server";

import { AuthConfig } from "@core/types";
import { login, logout } from "./actions";
import { serverSession } from "./session";
import { authRequestHandler } from "./handler";

const inDevelopmentMode = process.env.NODE_ENV == "development";

const NEW_USER_URL = inDevelopmentMode ? "/" : "/onboarding";

const config = {
    pages: {
        signIn: "/",
        signOut: "/",
        newUser: NEW_USER_URL,
    },
    token: {
        accessTokenLifespan: 15 * 60,
        refreshTokenLifespan: 86400 * 7, // 7 days
    },
    secrets: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    authBaseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`,
    errorURL: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error`,
} satisfies AuthConfig;

type handlerParam = { params: { route: string[] } };

function Auth(config: AuthConfig) {
    return {
        auth: async () => serverSession(config),
        signIn: (callbackURL?: string) => login(config, callbackURL),
        signOut: () => logout(config),
        handlers: {
            GET: async (req: NextRequest, { params }: handlerParam) =>
                authRequestHandler(config, req, params),
            POST: async (req: NextRequest, { params }: handlerParam) =>
                authRequestHandler(config, req, params),
        },
    };
}

export const { auth, handlers, signIn, signOut } = Auth(config);
