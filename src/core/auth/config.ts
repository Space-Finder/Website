import "server-only";

import { AuthConfig } from "@core/types";
import { ACCESS_TOKEN_EXPIRY } from "@lib/consts";

const AUTH_CONFIG = {
    pages: {
        signIn: "/dashboard",
        signOut: "/",
        newUser: "/onboarding",
    },
    token: {
        accessTokenLifespan: ACCESS_TOKEN_EXPIRY,
        refreshTokenLifespan: 60 * 60 * 24 * 7, // 7 Days
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

export default AUTH_CONFIG;
