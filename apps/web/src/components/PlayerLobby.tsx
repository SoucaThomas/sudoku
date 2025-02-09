"use client";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "../components/ui/card";
import { Tabs } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import CreateRoomDialog from "../components/CreateRoomDialog";
import { GameTypes } from "@repo/socket.io-types";
import JoinRoom from "./JoinRoom";

export default function PlayerLobby() {
    return (
        <Card className="h-full w-full">
            <Tabs defaultValue={GameTypes.SUDOKU} className="h-full w-full">
                <CardContent className="h-full w-full p-4">
                    <div className="flex h-full flex-col justify-between">
                        <div>
                            <CardTitle>
                                <h1 className="p-2 text-5xl sm:p-3 font-mono">Co-op sudoku</h1>
                            </CardTitle>
                            <Separator className="my-4" />
                            <CardFooter className="h-fit py-4 flex flex-row justify-center gap-6">
                                <JoinRoom className="text-lg">
                                    <Button variant={"outline"}>Join a Room!</Button>
                                </JoinRoom>
                                <CreateRoomDialog className="text-lg">
                                    <Button variant={"default"}>Create a Room!</Button>
                                </CreateRoomDialog>
                            </CardFooter>
                        </div>
                        <p className="ml-0 font-mono text-xs font-bold sm:ml-auto">
                            version: {process.env.NEXT_PUBLIC_APP_VERSION}
                        </p>
                    </div>
                </CardContent>
            </Tabs>
        </Card>
    );
}
