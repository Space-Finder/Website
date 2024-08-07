import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";

import prisma from "@/core/db/orm";

const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 min
const SCHOOL_DOMAIN = "ormiston.school.nz";

const OPTIONS = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: `https://accounts.google.com/o/oauth2/auth?response_type=code&hd=${SCHOOL_DOMAIN}`,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    callbacks: {
        signIn: ({ user }) =>
            !!(user.email && user.email.endsWith("@" + SCHOOL_DOMAIN)),
    },
    session: {
        strategy: "jwt",
        maxAge: ACCESS_TOKEN_EXPIRY,
    },
    events: {
        async signIn(message) {
            console.log("Signed in!", { message });
        },
        async signOut(message) {
            console.log("Signed out!", { message });
        },
        async createUser(message) {
            console.log("User created!", { message });
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(OPTIONS);
