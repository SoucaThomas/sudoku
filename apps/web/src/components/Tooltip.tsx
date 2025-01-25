"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Play, Pause, Timer } from "lucide-react";
import { useRoomStore } from "../lib/utils";
import { listenForGameUpdate } from "../actions/room";
import { Button } from "./ui/button";

export default function Tooltip() {
    const { room, startStopGame, setRoom } = useRoomStore();
    const [totalPlayTime, setTotalPlayTime] = React.useState(room.totalPlayTime);

    useEffect(() => {
        listenForGameUpdate(setRoom);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (room.isPlaying) {
            interval = setInterval(() => {
                const date = new Date();
                setTotalPlayTime(
                    date.getTime() - new Date(room.lastTimeStarted).getTime() + room.totalPlayTime
                );
            }, 500);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [room.isPlaying, room.lastTimeStarted, room.totalPlayTime]);

    useEffect(() => {
        setTotalPlayTime(room.totalPlayTime);
    }, [room]);
    return (
        <Card className="h-full w-full select-none overflow-hidden p-0 m-0">
            <CardContent className="flex flex-row p-0 px-6 h-full items-center justify-center space-x-6">
                <div className="flex flex-row items-center space-x-6">
                    <Button
                        variant="outline"
                        onClick={() => {
                            startStopGame();
                        }}
                    >
                        {room.isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </Button>
                    <p className="flex flex-col items-center space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                        Mistakes <span>3</span>
                    </p>
                    <p className="flex flex-col items-center space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <Timer />
                        <span className="tabular-nums">
                            {(totalPlayTime !== undefined &&
                                (totalPlayTime >= 3600000
                                    ? new Date(totalPlayTime)?.toISOString().substr(11, 8)
                                    : new Date(totalPlayTime)?.toISOString().substr(14, 5))) ||
                                "00:00"}
                        </span>
                    </p>
                    <p className="flex flex-col items-center space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0">
                        Score: <span className="tabular-nums">12003</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
