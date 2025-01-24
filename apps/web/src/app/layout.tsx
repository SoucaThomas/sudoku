import "../styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";
import Navbar from "../components/Navbar";

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
                    <main className="align-center flex h-full w-full justify-center">
                        {children}
                    </main>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
