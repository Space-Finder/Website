import { NextRequest } from "next/server";

import { AuthConfig } from "@core/types";
import { login, logout } from "./actions";
import { authRequestHandler } from "./http";
import { useServerSession } from "./session";

import AUTH_CONFIG from "./config";
import { handlerParam } from "@core/types";

function Auth(config: AuthConfig) {
    return {
        auth: async () => useServerSession(config),
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
