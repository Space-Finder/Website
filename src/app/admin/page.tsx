import React from "react";

import { auth } from "@auth";

export const metadata = {
    title: "SpaceFinder | Admin",
};

const AdminPortal = async () => {
    const user = await auth();

    if (!user || user.role !== "ADMIN") {
        return "unauthenticated";
    }

    return <div>AdminPortal</div>;
};

export default AdminPortal;
