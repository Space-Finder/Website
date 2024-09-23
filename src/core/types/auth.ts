import type { NextRequest } from "next/server";

export type AuthConfig = {
    pages?: {
        newUser?: string;
        signIn?: string;
        signOut?: string;
    };
    token?: {
        // Token lifespan is in seconds
        accessTokenLifespan?: number;
        refreshTokenLifespan?: number;
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
};

export interface AuthFunctions {
    auth: () => void;
    handlers: {
        GET: (req: NextRequest) => Promise<any>;
        POST: (req: NextRequest) => Promise<any>;
    };
    signIn: () => void;
    signOut: () => void;
}
