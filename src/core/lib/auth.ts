import Google from "next-auth/providers/google";
import NextAuth, { type NextAuthConfig } from "next-auth";

import prisma from "@/core/db/orm";
import { PrismaAdapter } from "@auth/prisma-adapter";

const inDevelopmentMode = process.env.NODE_ENV == "development";

const SIGN_IN_URL = "/login";
const NEW_USER_URL = inDevelopmentMode ? "/" : "/onboarding";

export const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 min
export const SCHOOL_DOMAIN = "ormiston.school.nz";

// defines what i'll be requesting from google
const GOOGLE_AUTHORIZATION_URL = {
    params: {
        prompt: "consent",
        access_type: "offline",
        hd: SCHOOL_DOMAIN, // so google allows only school domain logins
    },
    response_type: "code",
};

const CALLBACKS = {
    async jwt({ token, user, account }) {
        if (user && user.id) {
            token.id = user.id;
        }

        if (account) {
            // First-time login, save the `access_token`, its expiry and the `refresh_token`
            token.access_token = account.access_token!;
            token.expires_at = account.expires_at!;
            token.refresh_token = account.refresh_token!;

            return token;
        }

        // Subsequent logins, but the `access_token` is still valid
        if (Date.now() < token.expires_at * 1000) {
            return token;
        }

        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) {
            throw new TypeError("Missing refresh_token");
        }

        try {
            // refresh token
            const response = await fetch(
                "https://oauth2.googleapis.com/token",
                {
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: process.env.AUTH_GOOGLE_ID,
                        client_secret: process.env.AUTH_GOOGLE_SECRET,
                        grant_type: "refresh_token",
                        refresh_token: token.refresh_token!,
                    }),
                },
            );

            const tokensOrError = await response.json();

            if (!response.ok) {
                throw tokensOrError;
            }

            const newTokens = tokensOrError as {
                access_token: string;
                expires_in: number;
                refresh_token?: string;
            };

            token.access_token = newTokens.access_token;
            token.expires_at = Math.floor(
                Date.now() / 1000 + newTokens.expires_in,
            );

            if (newTokens.refresh_token) {
                token.refresh_token = newTokens.refresh_token;
            }
            return token;
        } catch (error) {
            // If we fail to refresh the token, return an error so we can handle it on the page
            console.error("Error refreshing access_token", error);
            token.error = "RefreshTokenError";
            return token;
        }
    },
    session({ session, token }) {
        session.user.id = token.id as string;
        return session;
    },
    authorized: async ({ auth }) => !!auth,
    // allow user to sign in if there email exists and ends with the school domain
    signIn: ({ user }) =>
        !!(user.email && user.email.endsWith("@" + SCHOOL_DOMAIN)),
} satisfies NextAuthConfig["callbacks"];

// these only work in devmode so I can see stuff
const EVENTS = inDevelopmentMode
    ? ({
          async signIn(message) {
              console.log("Signed in!", { message });
          },
          async signOut(message) {
              console.log("Signed out!", { message });
          },
          async createUser(message) {
              console.log("User created!", { message });
          },
      } satisfies NextAuthConfig["events"])
    : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: GOOGLE_AUTHORIZATION_URL,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    callbacks: CALLBACKS,
    pages: {
        newUser: NEW_USER_URL,
        signIn: SIGN_IN_URL,
    },
    session: {
        strategy: "jwt",
        maxAge: ACCESS_TOKEN_EXPIRY,
    },
    events: EVENTS,
});
