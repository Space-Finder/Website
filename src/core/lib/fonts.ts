import { Poppins, Inter, Roboto } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const roboto = Roboto({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
    weight: ["100", "300", "400", "500", "700", "900"],
});

export const all_fonts = [poppins, inter, roboto];
