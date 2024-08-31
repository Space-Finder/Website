"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

const Navbar = () => {
    const session = useSession();
    const signedIn = session.status === "authenticated";

    return (
        <nav className="border-b-2 border-black">
            <div className="m-6 flex items-center justify-between font-poppins">
                <div className="flex gap-2">
                    <Link href="/" className="text-2xl">
                        SpaceFinder
                    </Link>
                    <Image
                        src="/spacelogo.png"
                        alt="logo"
                        width={28}
                        height={24}
                        className="h-7 w-auto"
                    />
                </div>

                <button
                    onClick={() => {
                        signedIn ? signOut() : signIn("google");
                    }}
                    className="rounded-xl bg-[#0B1328] px-14 py-3 text-xl text-white"
                >
                    {signedIn ? "Logout" : "Login"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
