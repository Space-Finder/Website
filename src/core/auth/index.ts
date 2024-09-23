import { NextRequest } from "next/server";

import { login, logout } from "./client";
import { serverSession } from "./session";
import { authHTTPHandler } from "./handler";
import { AuthConfig, AuthFunctions } from "@core/types";
import SessionContextProvider, { useSession, SessionContext } from "./provider";

const inDevelopmentMode = process.env.NODE_ENV == "development";

const NEW_USER_URL = inDevelopmentMode ? "/" : "/onboarding";

export const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 min
export const SCHOOL_DOMAIN = "ormiston.school.nz";

const config = {
    pages: {
        signIn: "/",
        signOut: "/",
        newUser: NEW_USER_URL,
    },
    token: {
        accessTokenLifespan: ACCESS_TOKEN_EXPIRY,
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
} satisfies AuthConfig;

function Auth(config: AuthConfig): AuthFunctions {
    return {
        auth: () => serverSession(config),
        signIn: () => login(config),
        signOut: () => logout(config),
        handlers: {
            GET: async (req: NextRequest) => authHTTPHandler(config, req),
            POST: async (req: NextRequest) => authHTTPHandler(config, req),
        },
    };
}

const { auth, handlers, signIn, signOut } = Auth(config);

export {
    auth,
    handlers,
    signIn,
    signOut,
    SessionContextProvider,
    useSession,
    SessionContext,
};
