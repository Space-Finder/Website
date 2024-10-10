import React from "react";

import { auth } from "@auth";

export const metadata = {
    title: "SpaceFinder | Dashboard",
};

const Page = async () => {
    const session = await auth();

    if (!session) {
        return <>loading</>;
    }

    return (
        <div>
            <h1>Test</h1>
            <p>{session.id}</p>
            <p>{session.name}</p>
            <p>{session.role}</p>
            <p>{session.email}</p>
            <p>{session.image}</p>
            <p>{session.expiresAt}</p>
        </div>
    );
};

export default Page;
