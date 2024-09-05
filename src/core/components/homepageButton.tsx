"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function HomepageButton() {
    const session = useSession();
    const signedIn = session.status === "authenticated";

    if (signedIn) {
        return (
            <Link
                className="rounded-xl bg-[#5D7FD6] px-16 py-3 text-2xl text-white"
                href="/dashboard"
            >
                Go To Dashboard
            </Link>
        );
    }
    return (
        <button
            onClick={() => signIn("google")}
            className="rounded-xl bg-[#5D7FD6] px-16 py-3 text-2xl text-white"
        >
            Login
        </button>
    );
}
