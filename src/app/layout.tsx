import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";

import Providers from './providers';
import HeaderLayout from "@/components/header/HeaderLayout";
import FooterLayout from "@/components/footer/FooterLayout";

import "./styles/globals.css"
import "./styles/typography.css"
import "./styles/colorpalette.css"

const montserrat = Montserrat({
    variable: "--font-heading",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-body",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Amra Ekshathe",
    description: "Official website of Amra Ekshathe",
    icons: {
        icon: "/favicon.ico",
        shortcut: "#",
        apple: "#",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${montserrat.variable} ${inter.variable}`}>
                <Providers>
                    <HeaderLayout />
                        {children}
                    <FooterLayout />
                </Providers>
            </body>
        </html>
    );
}
