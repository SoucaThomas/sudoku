"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { askRooms, closeListenForRooms, listenForRooms } from "../actions/room";
import { useEffect } from "react";
import { GameRoom } from "@repo/socket.io-types";
import { useDiscoverStore } from "../lib/utils";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "./ui/table";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useState } from "react";

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
            <CardContent>
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
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : rooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No rooms available
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
            </CardContent>
        </Card>
    );
}
