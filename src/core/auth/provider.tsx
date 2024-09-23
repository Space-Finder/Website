"use client";

import React, { createContext, useContext, useState } from "react";

type Session = null;

type SessionContext = {
    session: Session;
    setSession: React.Dispatch<React.SetStateAction<Session>>;
} | null;

export const SessionContext = createContext<SessionContext>(null);

export default function SessionContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<Session>(null);

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

    context.session;
}
