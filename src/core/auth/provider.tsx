"use client";

import React, { createContext, useContext, useState } from "react";

import { Session } from "@core/types";

type SessionContext = {
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
} | null;

export const SessionContext = createContext<SessionContext>(null);

export default function SessionContextProvider({
    value,
    children,
}: {
    value: Session | null;
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session | null>(value);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw Error("useSession must be used within a SessionContextProvider");
    }

    return context.session;
}
