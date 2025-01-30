"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { askRooms, closeListenForRooms, listenForRooms } from "../actions/room";
import { useEffect } from "react";
import { GameRoom } from "@repo/socket.io-types";
import { useDiscoverStore } from "../lib/utils";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "./ui/table";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export default function OpenGames() {
    const { rooms, setRooms } = useDiscoverStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        askRooms()
            .then((rooms: GameRoom[]) => {
                setRooms(rooms);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });

        listenForRooms(setRooms);

        return () => {
            closeListenForRooms();
        };
    }, []);

    return (
        <Card className="h-full w-full select-none overflow-y-scroll ">
            <CardContent className="h-full w-full">
                {rooms.length === 0 ? (
                    <CardTitle className="w-full h-full flex items-center justify-center">
                        No rooms available
                    </CardTitle>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Name</TableHead>
                                <TableHead>Game Mode</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Players</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        <Spinner size="lg" className="bg-black dark:bg-white" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rooms.map((room: GameRoom) => (
                                    <TableRow
                                        key={room.roomId}
                                        className="text-center"
                                        onClick={() => {
                                            window.location.href = `/room/${room.roomId}`;
                                        }}
                                    >
                                        <TableCell>
                                            {room.roomName.length > 10
                                                ? `${room.roomName.slice(0, 10)}...`
                                                : room.roomName}
                                        </TableCell>
                                        <TableCell>{room.roomGame}</TableCell>
                                        <TableCell>{room.roomDifficulty}</TableCell>
                                        <TableCell>{room.roomUsers.length}</TableCell>
                                        <TableCell>
                                            <LockKeyhole
                                                size={15}
                                                className={room.isRoomPublic ? "hidden" : ""}
                                            />
                                            <LockKeyholeOpen
                                                size={15}
                                                className={room.isRoomPublic ? "" : "hidden"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
