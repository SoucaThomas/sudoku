"use client";

import { UserPen } from "lucide-react";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import CreateRoomDialog from "../components/CreateRoomDialog";
import { GameTypes, ColorValues, MessageType } from "@repo/socket.io-types";
import { useEffect, useState, useRef } from "react";
import { UserProvider } from "../lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useTheme } from "next-themes";
import Message from "./Message";

export default function PlayerLobby() {
    const [userName, setUserName] = useState("");
    const user = new UserProvider().getUser();
    const { theme } = useTheme();
    const [refresh, setRefresh] = useState(0);
    const messageRef = useRef<HTMLDivElement>(null);

    const refreshMessage = () => {
        setRefresh((prev) => prev + 1);
    };

    useEffect(() => {
        const user = new UserProvider().getUser();
        setUserName(user.userName);
    }, []);
    return (
        <Card className="h-full w-full">
            <Tabs defaultValue={GameTypes.SUDOKU} className="h-full w-full">
                <CardContent className="h-full w-full p-4">
                    <div className="flex h-full flex-col justify-between">
                        <div>
                            <CardTitle>
                                <h1 className="p-2 text-5xl sm:p-3">RT-sudoku</h1>
                            </CardTitle>
                            <Separator className="my-4" />
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                            </CardHeader>
                            <CardDescription className="sm:flex sm:items-center sm:justify-between sm:gap-2">
                                <Input
                                    placeholder="Enter your username"
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value);
                                        const user = JSON.parse(
                                            localStorage.getItem("user") || "{}"
                                        );
                                        user.userName = e.target.value;
                                        localStorage.setItem("user", JSON.stringify(user));
                                    }}
                                />
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant={"default"}>
                                            <UserPen className="h-6 w-6" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <div ref={messageRef}>
                                            <Message
                                                message={
                                                    {
                                                        message: `Hello! I'm ${userName}`,
                                                        user: user,
                                                    } as MessageType
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(ColorValues).map((color, index) => {
                                                return (
                                                    <Button
                                                        key={index}
                                                        className="w-12 h-12"
                                                        style={{
                                                            backgroundColor:
                                                                theme === "dark"
                                                                    ? ColorValues[color].dark
                                                                    : ColorValues[color].light,
                                                        }}
                                                        onClick={() => {
                                                            const updatedUser = {
                                                                ...user,
                                                                color: color,
                                                            };
                                                            new UserProvider().setUser(updatedUser);

                                                            refreshMessage();
                                                        }}
                                                    ></Button>
                                                );
                                            })}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardDescription>
                            <CardFooter className="h-fit py-4">
                                <CreateRoomDialog className="mx-auto mt-2 text-lg">
                                    <Button variant={"default"}>Create a Room!</Button>
                                </CreateRoomDialog>
                            </CardFooter>
                        </div>
                        <p className="ml-0 font-mono text-xs font-bold sm:ml-auto">
                            version: 0.13.4
                        </p>
                    </div>
                </CardContent>
            </Tabs>
        </Card>
    );
}
