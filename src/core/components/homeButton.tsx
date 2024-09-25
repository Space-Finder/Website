"use client";

import Link from "next/link";
import { signInOut } from "@lib/actions";
import { useSession } from "@core/auth/provider";

export default function HomepageButton() {
    const session = useSession();
    const signedIn = session !== null;

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
            onClick={() => signInOut(signedIn)}
            className="rounded-xl bg-[#5D7FD6] px-16 py-3 text-2xl text-white"
        >
            Login
        </button>
    );
}