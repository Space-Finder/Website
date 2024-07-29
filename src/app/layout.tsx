import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import { auth } from "@/core/lib/auth";
import Navbar from "@/core/components/navbar";

const poppins = Poppins({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins", // you can use the 'poppins' variable in your styles or components
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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

    return (
        <html lang="en">
            <body className={poppins.className}>
                <SessionProvider session={session}>
                    <Navbar />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
