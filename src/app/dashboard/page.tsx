import React from "react";

import { getUser } from "@/core/db/utils";

const Dashboard = async () => {
    const user = await getUser();

    return (
        <div>
            <h1>HI GUYS!</h1>
        </div>
    );
};

export default Dashboard;
