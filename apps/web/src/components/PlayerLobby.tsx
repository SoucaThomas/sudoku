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
import { GameTypes } from "../lib/utils";
import type { GameDifficulties } from "../lib/utils";

export default function PlayerLobby() {
  const createRoom = (
    roomName: string,
    roomPassword: string,
    privateGame: boolean,
    gameType: GameTypes,
    gameDifficulty: GameDifficulties,
  ) => {
    console.log(roomName, roomPassword, privateGame, gameType, gameDifficulty);
  };

  return (
    <Card className="h-full w-full">
      <Tabs defaultValue={GameTypes.SUDOKU} className="h-full w-full">
        {/* <TabsList className="mx-auto grid w-80 grid-cols-2">
    {gameTabs.map((tab, index) => (
      <TabsTrigger value={tab} key={index}>
      {tab}
      </TabsTrigger>
      ))}
      </TabsList> */}
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
                <Input placeholder="Enter your username" />
                <Button variant={"default"} className="hidden sm:block">
                  <UserPen className="h-6 w-6" />
                </Button>
              </CardDescription>
              <CardFooter className="h-fit py-4">
                <CreateRoomDialog
                  createRoom={createRoom}
                  className="mx-auto mt-2 text-lg"
                >
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
