import { InputJsonValue } from "@prisma/client/runtime/library";
import { prisma, Room } from "./client";

import { Status, User, type CreateRoomData, Board } from "@repo/socket.io-types";

export function getRooms() {
    return prisma.room.findMany();
}

export function getRoom(roomId: string) {
    if (!/^[0-9a-fA-F]{24}$/.test(roomId)) {
        return;
    }
    return prisma.room.findUnique({
        where: {
            roomId,
        },
    });
}

export async function create({ boards, data }: { boards: Board; data: CreateRoomData }) {
    const room = await prisma.room.create({
        data: {
            roomName: data.roomName,
            roomPassword: data.roomPassword,
            roomGame: data.roomGame,
            roomDifficulty: data.roomDifficulty,
            isRoomPublic: data.isRoomPublic,
            roomHostId: data.roomHostId || "",
            roomUsers: [],
            isPlaying: false,
            totalPlayTime: 0,
            lastTimeStarted: new Date(),
            status: Status.PLAYING,
        },
    });

    const board = await prisma.board.create({
        data: {
            roomId: room.roomId,
            serverBoard: boards.serverBoard,
            clientBoard: boards.clientBoard,
            solution: boards.solution || "",
            mistakes: 0,
            score: 0,
        },
    });

    await prisma.room.update({
        where: {
            roomId: room.roomId,
        },
        data: {
            boardId: board.boardId,
        },
    });

    return room;
}

export function addUserToRoom(roomId: string, userId: User["userId"]) {
    return prisma.room.update({
        where: {
            roomId,
        },
        data: {
            roomUsers: {
                push: userId,
            },
        },
    });
}

export function removeUserFromRoom({ roomId, userId }: { roomId: string; userId: User["userId"] }) {
    // return prisma.room.update({
    //     where: {
    //         roomId,
    //     },
    //     data: async () => {
    //         const room = await prisma.room.findUnique({
    //             where: { roomId },
    //             select: { roomUsers: true },
    //         });
    //         return {
    //             roomUsers: {
    //                 set: room?.roomUsers.filter((id) => id !== userId) || [],
    //             },
    //         };
    //     },
    // });
    return prisma.room.findUnique({
        where: {
            roomId,
        },
    });
}

export function updateRoom(roomId: string, data: Room) {
    const { roomId: _, ...updateData } = data;
    return prisma.room.update({
        where: {
            roomId,
        },
        data: {
            ...updateData,
            roomUsers: updateData.roomUsers as unknown as InputJsonValue[], // assuming data.roomUsers is already an array of IDs
        },
    });
}

export function deleteRoom(roomId: string) {
    return prisma.room.delete({
        where: {
            roomId,
        },
    });
}
