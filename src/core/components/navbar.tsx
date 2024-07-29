"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

const Navbar = () => {
    const session = useSession();
    const signedIn = session.status === "authenticated";

    return (
        <nav className="border-black border-b-2">
            <div className="flex justify-between m-6 items-center font-poppins">
                <h1 className="text-2xl">SpaceFinder</h1>
                <form
                    action={async () => {
                        signedIn ? signOut() : signIn("google");
                    }}
                >
                    <button
                        type="submit"
                        className="text-white text-xl bg-[#0B1328] py-3 px-14 rounded-xl"
                    >
                        {signedIn ? "Logout" : "Login"}
                    </button>
                </form>
            </div>
        </nav>
    );
};

export default Navbar;
