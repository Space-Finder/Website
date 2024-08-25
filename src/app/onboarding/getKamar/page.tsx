"use client";
import React, { useState } from "react";
import handleSubmit from "./savepass";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function NewUserOnboarding() {
    const [kamarPassword, setKamarPassword] = useState("");
    const session = useSession();

    if (!(session.status === "authenticated")) {
        return redirect("/login");
    }

    return (
        <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center">
            <h1 className="mb-6 text-3xl font-bold">Kamar Password Needed!</h1>
            <form
                action={(e) =>
                    handleSubmit(session.data.user.id, kamarPassword)
                }
                className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
            >
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                        Kamar Password
                    </label>
                    <input
                        type="password"
                        value={kamarPassword}
                        onChange={(e) => setKamarPassword(e.target.value)}
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                >
                    Save and Continue
                </button>
            </form>
        </div>
    );
}
