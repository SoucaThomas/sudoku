"use client";

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
import { GameTypes } from "@repo/socket.io-types";
import { useEffect, useState } from "react";
import { UserProvider } from "../lib/utils";

export default function PlayerLobby() {
    const [userName, setUserName] = useState("");

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
                            <CardDescription className="flex items-center justify-between gap-2">
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
