"use client";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            suppressHydrationWarning
            className="top-0 mb-4 flex w-full flex-row items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800"
        >
            <div className="flex-grow"></div>
            <Button
                variant={"outline"}
                onClick={() => {
                    console.log("Theme toggled");
                    setTheme(theme === "dark" ? "light" : "dark");
                }}
                suppressHydrationWarning
            >
                {theme === "dark" ? (
                    <Sun suppressHydrationWarning />
                ) : (
                    <Moon suppressHydrationWarning />
                )}
            </Button>
        </div>
    );
}
