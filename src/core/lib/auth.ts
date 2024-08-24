import Google from "next-auth/providers/google";
import NextAuth, { type NextAuthConfig } from "next-auth";

import prisma from "@/core/db/orm";
import { PrismaAdapter } from "@auth/prisma-adapter";

const SIGN_IN_URL = "/login";
const NEW_USER_URL = "/onboarding";

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 min
const SCHOOL_DOMAIN = "ormiston.school.nz";
const inDevelopmentMode = process.env.NODE_ENV == "development";

const GOOGLE_AUTHORIZATION_URL = {
    params: {
        prompt: "consent",
        access_type: "offline",
        hd: SCHOOL_DOMAIN,
    },
    response_type: "code",
};

const CALLBACKS = {
    jwt({ token, user }) {
        if (user && user.id) {
            token.id = user.id;
        }
        return token;
    },
    session({ session, token }) {
        session.user.id = token.id as string;
        return session;
    },
    authorized: async ({ auth }) => !!auth,
    signIn: ({ user }) =>
        !!(user.email && user.email.endsWith("@" + SCHOOL_DOMAIN)),
} satisfies NextAuthConfig["callbacks"];

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
