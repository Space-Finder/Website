import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import "@radix-ui/themes/styles.css";

import { auth, ACCESS_TOKEN_EXPIRY } from "@/core/lib/auth";
import { Theme } from "@radix-ui/themes";
import { all_fonts } from "@/core/lib/fonts";
import Navbar from "@/core/components/navbar";

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
                    </Theme>
                </SessionProvider>
            </body>
        </html>
    );
}
