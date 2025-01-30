"use client";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Trash, User } from "lucide-react";
import { useRoomStore, UserProvider } from "../lib/utils";
import { Home, Menu, Pause, Play, X, Clipboard } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { CardContent, CardTitle } from "./ui/card";
import SettingsComponent from "./settingsComponent";
import { clearBoard } from "../actions/room";
import ColorSelectorDialog from "./ColorSelectorDialog";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
                        <div className="flex flex-col items-center  space-y-4">
                            <CardContent className="w-full p-3 flex flex-col">
                                <CardTitle className="mb-2">Settings</CardTitle>
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
                                    text="Edit Profile"
                                    onClick={() => {
                                        setIsDialogOpen(!isDialogOpen);
                                    }}
                                >
                                    <ColorSelectorDialog
                                        isDialogOpen={isDialogOpen}
                                        setIsDialogOpen={setIsDialogOpen}
                                    />
                                </SettingsComponent>
                                {room.roomGame && (
                                    <>
                                        <SettingsComponent
                                            icon={room.isPlaying ? Pause : Play}
                                            text={room.isPlaying ? "Pause Game" : "Start Game"}
                                            onClick={startStopGame}
                                        />
                                        <SettingsComponent
                                            icon={Trash}
                                            text="Clear Board"
                                            onClick={clearBoard}
                                        />
                                    </>
                                )}
                                {new UserProvider().getUser().userId === room.roomHost?.userId && (
                                    <>
                                        <CardTitle className="my-2 mt-5">Admin Settings</CardTitle>
                                        <SettingsComponent
                                            icon={X}
                                            text="Kick"
                                            buttonVariant="destructive"
                                            disabled={room.roomUsers.length === 1}
                                            onClick={() => {
                                                console.log("Kicked"); //! TODO Implement kick
                                            }}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </div>
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
