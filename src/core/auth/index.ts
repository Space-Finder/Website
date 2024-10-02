import { cache } from "react";
import { NextRequest } from "next/server";

import AUTH_CONFIG from "./config";
import { login, logout } from "./actions";
import { authRequestHandler } from "./http";
import { useServerSession } from "./session";
import { handlerParam, AuthConfig } from "@core/types";

function Auth(config: AuthConfig) {
    return {
        auth: cache(async () => useServerSession(config)),
        signIn: (callbackURL?: string) => login(config, callbackURL),
        signOut: () => logout(config),
        handlers: {
            GET: async (req: NextRequest, { params }: handlerParam) =>
                authRequestHandler(config, req, params),
            POST: async (req: NextRequest, { params }: handlerParam) =>
                authRequestHandler(config, req, params),
        },
    };
}

export const { auth, handlers, signIn, signOut } = Auth(AUTH_CONFIG);
