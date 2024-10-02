"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";
import { decodeJwt } from "jose";

import {
    Session,
    SessionStatus,
    SessionContext as SessionContextT,
} from "@core/types";
import { ACCESS_TOKEN_EXPIRY } from "@lib/consts";

export const SessionContext = createContext<SessionContextT | null>(null);

const ms = (v: number) => v * 1000;

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
                setSession(decodeJwt(response.data.accessToken));
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
            return;
        }

        setSession(value);
        setStatus("authenticated");
    }, [value, fetchSession]);

    useEffect(() => {
        if (session === null) {
            return;
        }

        const initialExpiresIn = session.expiresAt;

        const timeUntilExpiry =
            (initialExpiresIn - new Date().getTime()) / 1000;

        const firstRefreshTime = Math.min(
            timeUntilExpiry - 60, // try to refresh a min before expiring
            ACCESS_TOKEN_EXPIRY,
        );

        let intervalId: NodeJS.Timeout;
        const refreshSessionInterval = () => {
            refreshSession();

            if (intervalId) {
                clearInterval(intervalId);
            }
            intervalId = setInterval(() => {
                refreshSession();
            }, ms(ACCESS_TOKEN_EXPIRY));
        };

        const firstTimeoutId = setTimeout(
            refreshSessionInterval,
            ms(firstRefreshTime),
        );

        return () => {
            clearTimeout(firstTimeoutId);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [fetchSession, refreshSession]);

    return (
        <SessionContext.Provider
            value={
                {
                    data: session,
                    status,
                    setSession,
                    refreshSession,
                } as SessionContextT
            }
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContextT {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error(
            "useSession must be used within a SessionContextProvider",
        );
    }

    return context;
}
