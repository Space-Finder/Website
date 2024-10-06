import React from "react";

import { auth } from "@core/auth";

const AdminPortal = async () => {
    const user = await auth();

    if (!user || user.role !== "ADMIN") {
        return "unauthenticated";
    }

    return <div>AdminPortal</div>;
};

export default AdminPortal;
