"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { Session } from "@core/types";

type SessionStatus = "authenticated" | "unauthenticated" | "loading";

type SessionContext = {
    session: Session | null;
    status: SessionStatus;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
};

export const SessionContext = createContext<SessionContext | null>(null);

export default function SessionContextProvider({
    value,
    children,
}: {
    value: Session | null;
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session | null>(value);
    const [status, setStatus] = useState<SessionStatus>("loading");

    useEffect(() => {
        if (value) {
            setStatus("authenticated");
        }
    }, [value]);

    return (
        <SessionContext.Provider value={{ session, status, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContext {
    const context = useContext(SessionContext);
    if (!context) {
        throw Error("useSession must be used within a SessionContextProvider");
    }

    return context;
}
