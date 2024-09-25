import "server-only";

import { AuthConfig } from "@core/types";

const inDevelopmentMode = process.env.NODE_ENV == "development";
const NEW_USER_URL = inDevelopmentMode ? "/" : "/onboarding";

const AUTH_CONFIG = {
    pages: {
        signIn: "/dashboard",
        signOut: "/",
        newUser: NEW_USER_URL,
    },
    token: {
        accessTokenLifespan: 60 * 15, // 15 Minutes
        refreshTokenLifespan: 60 * 60 * 24 * 7, // 7 Days
    },
    secrets: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        csrfTokenSecret: process.env.CSRF_TOKEN_SECRET,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    authBaseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`,
    errorURL: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error`,
} satisfies AuthConfig;

export default AUTH_CONFIG;
