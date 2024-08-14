import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import { auth } from "@/core/lib/auth";
import { all_fonts } from "@/core/lib/fonts";
import Navbar from "@/core/components/navbar";

export const metadata: Metadata = {
    title: "Space Finder",
    description: "Classroom Allocation Made Simple",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const font_classname = all_fonts.map((font) => font.variable).join(" ");

    return (
        <html lang="en">
            <body className={font_classname}>
                <SessionProvider session={session}>
                    <Navbar />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
