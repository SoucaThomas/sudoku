import { InputJsonValue } from "@prisma/client/runtime/library";
import { prisma, Room } from "./client";

import { Status, User, type CreateRoomData, Board, GameRoom } from "@repo/socket.io-types";

export const getRooms = async () => {
    const rooms = await prisma.room.findMany({
        include: {
            users: true,
        },
    });

    return rooms;
};

export const getRoom = async (roomId: string) => {
    return await prisma.room.findUnique({
        where: {
            roomId: roomId,
        },
        include: {
            users: true,
        },
    });
};

export async function create({ boards, data }: { boards: Board; data: CreateRoomData }) {
    const room = await prisma.room.create({
        data: {
            roomName: data.roomName,
            roomPassword: data.roomPassword,
            roomGame: data.roomGame,
            roomDifficulty: data.roomDifficulty,
            isRoomPublic: data.isRoomPublic,

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

export const addUserToRoom = async ({ userId, roomId }: { userId: string; roomId: string }) => {
    return await prisma.room.update({
        where: { roomId },
        data: {
            users: {
                connect: { id: userId },
            },
        },
    });
};

export function removeUserFromRoom({ roomId, user }: { roomId: string; user: User }) {
    return prisma.room.update({
        where: { roomId },
        data: {
            users: {
                disconnect: { id: user.id },
            },
        },
        include: {
            users: true,
        },
    });
}

export function startStop(roomId: string, data: Room) {
    return prisma.room.update({
        where: {
            roomId,
        },
        data: {
            isPlaying: data.isPlaying,
            lastTimeStarted: data.lastTimeStarted,
            totalPlayTime: data.totalPlayTime,
        },
    });
}

export const updateRoom = async (room: GameRoom) => {
    return await prisma.room.update({
        where: {
            roomId: room.roomId,
        },
        data: {
            roomName: room.roomName,
            roomPassword: room.roomPassword,
            roomGame: room.roomGame,
            roomDifficulty: room.roomDifficulty,
            isRoomPublic: room.isRoomPublic,
            isPlaying: room.isPlaying,
            totalPlayTime: room.totalPlayTime,
            lastTimeStarted: room.lastTimeStarted || new Date(),
            status: room.status,
            users: {
                set: room.users.map((user) => ({ id: user.id })),
            },
        },
    });
};

// export function deleteRoom(roomId: string) {
//     return prisma.room.delete({
//         where: {
//             roomId,
//         },
//     });
// }
