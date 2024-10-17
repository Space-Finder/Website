import "dotenv/config";
import type { Metadata } from "next";
import { config as fontawesomeConfig } from "@fortawesome/fontawesome-svg-core";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { auth } from "@auth";
import FONTS from "@lib/fonts";

import { Provider } from "@components/provider";
import SessionContextProvider from "@core/auth/provider";

export const metadata: Metadata = {
    title: "Space Finder",
    description: "Classroom Allocation Made Simple",
};

const BACKGROUND_COLOR = "#f8f3ef";

fontawesomeConfig.autoAddCss = false;

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const FONT_CLASSNAMES = FONTS.map((font) => font.variable).join(" ");

    return (
        <html lang="en">
            <body className={`bg-[${BACKGROUND_COLOR}] ${FONT_CLASSNAMES}`}>
                <SessionContextProvider value={session}>
                    <Provider>{children}</Provider>
                </SessionContextProvider>
            </body>
        </html>
    );
}
