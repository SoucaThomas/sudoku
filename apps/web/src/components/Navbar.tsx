"use client";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, User } from "lucide-react";
import { useRoomStore, UserProvider } from "../lib/utils";
import { Home, Menu, Pause, Play, X, Clipboard } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Card, CardContent, CardTitle } from "./ui/card";
import SettingsComponent from "./settingsComponent";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { room, startStopGame } = useRoomStore();

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
            <div className="flex-grow">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="mr-4 ">
                            <Menu></Menu>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" align="center">
                        <Card className="flex flex-col items-center  space-y-4">
                            <CardContent className="w-full p-3 flex flex-col">
                                <CardTitle>Settings</CardTitle>
                                {/* <div className="w-full p-3 flex flex-row justify-between items-center">
                                    <p>Return to home</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            window.location.href = "/";
                                        }}
                                    >
                                        <Home size={24} />
                                    </Button>
                                </div> */}
                                <SettingsComponent
                                    icon={Home}
                                    text="Return to home"
                                    onClick={() => {
                                        window.location.href = "/";
                                    }}
                                />
                                {room.roomGame && (
                                    <SettingsComponent
                                        icon={Clipboard}
                                        text="Share Room"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href); //! TODO Implement share room with chat message and fancy animation
                                        }}
                                    />
                                )}
                                <SettingsComponent
                                    icon={User}
                                    text="Edit Profile"
                                    onClick={() => {
                                        window.location.href = "/";
                                    }}
                                />
                                {room.roomGame && (
                                    <SettingsComponent
                                        icon={room.isPlaying ? Pause : Play}
                                        text={room.isPlaying ? "Pause Game" : "Start Game"}
                                        onClick={startStopGame}
                                    />
                                )}
                                {new UserProvider().getUser().userId === room.roomHost?.userId && (
                                    <>
                                        <CardTitle>Admin Settings</CardTitle>
                                        <SettingsComponent
                                            icon={X}
                                            text="Kick"
                                            buttonVariant="destructive"
                                            onClick={() => {
                                                console.log("Kicked"); //! TODO Implement kick
                                            }}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </PopoverContent>
                </Popover>
            </div>
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
