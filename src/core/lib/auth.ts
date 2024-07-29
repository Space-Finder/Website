import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";

import prisma from "@/core/db/orm";

const OPTIONS = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 15 * 60, // 15 min
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
