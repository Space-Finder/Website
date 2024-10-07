"use client";

import Link from "next/link";

import { loginAction } from "@lib/actions";
import { useSession } from "@hooks/session";

export default function HomepageButton() {
    const session = useSession();
    const signedIn = session.status === "authenticated";

    if (signedIn) {
        return (
            <div className="flex gap-5">
                <Link
                    className="rounded-xl bg-[#5D7FD6] px-16 py-3 text-2xl text-white"
                    href="/dashboard"
                >
                    Go To Dashboard
                </Link>
                {session.data.role === "ADMIN" && (
                    <Link
                        className="rounded-xl bg-[#5D7FD6] px-16 py-3 text-2xl text-white"
                        href="/admin"
                    >
                        Go To Admin Panel
                    </Link>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={loginAction}
            className="rounded-xl bg-[#5D7FD6] px-16 py-3 text-2xl text-white"
        >
            Login
        </button>
    );
}
