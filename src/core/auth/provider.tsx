"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";

import { Session } from "@core/types";

type SessionStatus = "authenticated" | "unauthenticated" | "loading";

type SessionContext = {
    session: Session | null;
    status: SessionStatus;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
    refreshSession: () => Promise<void>;
};

const EXPIRY = 15 * 60 * 1000; // 15 minutes to ms

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

    const fetchSession = useCallback(async () => {
        try {
            setStatus("loading");
            const response = await axios.get("/api/auth/session", {
                withCredentials: true,
            });
            if (response.data) {
                setSession(response.data);
                setStatus("authenticated");
            } else {
                setSession(null);
                setStatus("unauthenticated");
            }
        } catch (error) {
            console.error("Failed to fetch session", error);
            setSession(null);
            setStatus("unauthenticated");
        }
    }, []);

    const refreshSession = useCallback(async () => {
        try {
            const response = await axios.post(
                "/api/auth/refresh",
                {},
                { withCredentials: true },
            );
            if (response.data) {
                setSession(response.data);
                setStatus("authenticated");
            }
        } catch (error) {
            console.error("Failed to refresh token", error);
            setSession(null);
            setStatus("unauthenticated");
        }
    }, []);

    useEffect(() => {
        if (value === null) {
            fetchSession();
        } else {
            setSession(value);
            setStatus("authenticated");
        }
    }, [value, fetchSession]);

    useEffect(() => {
        if (value === null) {
            fetchSession();
        } else {
            setSession(value);
            setStatus("authenticated");

            const initialExpiresIn = value.expiresAt;

            if (initialExpiresIn) {
                const timeUntilExpiry =
                    (initialExpiresIn - new Date().getTime()) / 1000;

                const firstRefreshTime = Math.min(timeUntilExpiry - 60, EXPIRY);

                const firstTimeoutId = setTimeout(() => {
                    refreshSession();
                }, firstRefreshTime * 1000);

                const intervalId = setInterval(() => {
                    refreshSession();
                }, EXPIRY);

                return () => {
                    clearTimeout(firstTimeoutId);
                    clearInterval(intervalId);
                };
            }
        }
    }, [value, fetchSession, refreshSession]);

    return (
        <SessionContext.Provider
            value={{ session, status, setSession, refreshSession }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContext {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error(
            "useSession must be used within a SessionContextProvider",
        );
    }

    return context;
}
