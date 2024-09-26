"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { loginAction } from "@lib/actions";
import { useSession } from "@core/auth/provider";

import Logo from "/public/spacelogo.png";

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
                        src={Logo}
                        alt="logo"
                        className="h-7 w-auto"
                        placeholder="blur"
                    />
                </div>

                {signedIn ? (
                    <button
                        className="rounded-xl bg-[#0B1328] px-14 py-3 text-xl text-white"
                        onClick={() => {
                            window.location.href = "/api/auth/signOut";
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <form action={loginAction}>
                        <button
                            className="rounded-xl bg-[#0B1328] px-14 py-3 text-xl text-white"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
