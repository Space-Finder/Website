import "dotenv/config";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";

import { Theme } from "@radix-ui/themes";
import { all_fonts } from "@/core/lib/fonts";
import Navbar from "@/core/components/navbar";
import { auth, ACCESS_TOKEN_EXPIRY } from "@/core/lib/auth";

export const metadata: Metadata = {
    title: "Space Finder",
    description: "Classroom Allocation Made Simple",
};

const BACKGROUND_COLOR = "#f8f3ef";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const font_classnames = all_fonts.map((font) => font.variable).join(" ");

    return (
        <html lang="en">
            <body className={`bg-[${BACKGROUND_COLOR}] ${font_classnames}`}>
                <SessionProvider
                    session={session}
                    refetchInterval={ACCESS_TOKEN_EXPIRY}
                >
                    <Theme hasBackground={false}>
                        <Navbar />
                        {children}
                        <ToastContainer />
                    </Theme>
                </SessionProvider>
            </body>
        </html>
    );
}
