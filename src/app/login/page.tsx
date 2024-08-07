import React from "react";
import { signIn } from "@/core/lib/auth";

const Login = ({
    searchParams,
}: {
    searchParams: { callbackUrl: string | undefined };
}) => {
    const redirectTo = searchParams.callbackUrl ?? "/dashboard";

    return (
        <div>
            <h1>Please sign in with your school provided google account:</h1>
            <form
                action={async () => {
                    "use server";
                    await signIn("google", { redirectTo });
                }}
            >
                <button
                    type="submit"
                    className="rounded-xl bg-[#0B1328] px-14 py-3 text-xl text-white"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
