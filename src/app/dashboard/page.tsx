"use client";

import React from "react";

import { useSession } from "@hooks/session";

const Page = () => {
    const session = useSession();

    if (session.status !== "authenticated") {
        return <>loading</>;
    }

    return (
        <div>
            <h1>Test</h1>
            <p>{session.data.id}</p>
            <p>{session.data.name}</p>
            <p>{session.data.role}</p>
            <p>{session.data.email}</p>
            <p>{session.data.image}</p>
            <p>{session.data.expiresAt}</p>
        </div>
    );
};

export default Page;
