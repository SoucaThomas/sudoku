import "../styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Transition from "../components/Transition";

export const metadata: Metadata = {
    title: "Sudoku Online",
    description: "A multiplayer sudoku game",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
            <body className="h-dvh w-full overflow-hidden">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <Transition> {children}</Transition>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
