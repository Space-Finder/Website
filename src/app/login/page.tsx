import React from "react";
import { redirect } from "next/navigation";

import { signIn, auth } from "@auth";
import { SCHOOL_DOMAIN } from "@lib/consts";

const Login = async ({
    searchParams,
}: {
    searchParams: { callbackUrl: string | undefined };
}) => {
    // find the url to redirect the user to after they login, if not found default to dashboard
    const redirectTo = searchParams.callbackUrl ?? "/dashboard";

    const session = await auth();
    if (session) {
        // if already signed in, redirect back to where they were
        await redirect(redirectTo);
    }

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
                    You are NOT logged in!
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                    Please login with your school provided google account ending
                    with @{SCHOOL_DOMAIN}
                </p>

                <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
                    <form
                        action={async () => {
                            "use server";
                            await signIn(redirectTo);
                        }}
                    >
                        <button
                            type="submit"
                            className="flex w-1/2 items-center justify-center gap-x-2 rounded-xl border border-gray-700 bg-gray-900 px-24 py-3 text-lg text-gray-200 transition-colors duration-200 hover:bg-gray-800 sm:w-auto"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
