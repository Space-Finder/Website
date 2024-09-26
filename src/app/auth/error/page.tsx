import React from "react";

import { SCHOOL_DOMAIN } from "@lib/consts";

const AuthErrorHandler = async ({
    searchParams,
}: {
    searchParams: { type: string | undefined };
}) => {
    const { type } = searchParams;

    if (!type) {
        return <div>Something went wrong :(</div>;
    }

    if (type === "InvalidCode") {
        return (
            <div>
                Either you provided no code or the one provided was invalid
            </div>
        );
    } else if (type == "CouldNotFetch") {
        return <div>Failed to fetch user details from google</div>;
    } else if (type == "NotSchoolEmail") {
        return (
            <div>
                You must sign in with an email ending with {SCHOOL_DOMAIN}
            </div>
        );
    }

    return <div>Something Went Wrong</div>;
};

export default AuthErrorHandler;
