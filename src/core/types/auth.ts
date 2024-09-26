import z from "zod";

import { RoleValidator } from "@lib/validators";

export type AuthConfig = {
    pages: {
        newUser: string;
        signIn: string;
        signOut: string;
    };
    token: {
        accessTokenLifespan: number;
        refreshTokenLifespan: number;
    };
    secrets: {
        accessTokenSecret: string;
        refreshTokenSecret: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
    };
    authBaseURL: string;
    errorURL: string;
};

export type ServerSession = Session | null;

export type Role = z.infer<typeof RoleValidator>;

export type Session = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    expiresAt: number;
    role: Role;
};

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export type SessionStatus = "authenticated" | "unauthenticated" | "loading";

export type SessionContext = {
    session: Session | null;
    status: SessionStatus;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
    refreshSession: () => Promise<void>;
};

export type handlerParam = { params: { route: string[] } };
