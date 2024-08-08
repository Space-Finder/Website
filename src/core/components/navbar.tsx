"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

const Navbar = () => {
    const session = useSession();
    const signedIn = session.status === "authenticated";

    return (
        <nav className="border-b-2 border-black">
            <div className="font-poppins m-6 flex items-center justify-between">
                <Link href="/" className="text-2xl">
                    SpaceFinder
                </Link>
                <form
                    action={async () => {
                        signedIn ? signOut() : signIn("google");
                    }}
                >
                    <button
                        type="submit"
                        className="rounded-xl bg-[#0B1328] px-14 py-3 text-xl text-white"
                    >
                        {signedIn ? "Logout" : "Login"}
                    </button>
                </form>
            </div>
        </nav>
    );
};

export default Navbar;
