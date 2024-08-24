import NextAuth, { type DefaultSession } from "next-auth";
import { type User as DatabaseUser } from "@prisma/client";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: { id: string };
    }
    interface User extends DatabaseUser {}
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
    }
}
