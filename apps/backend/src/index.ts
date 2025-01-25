import express from "express";
import http from "http";
import cors from "cors";
import { Socket } from "socket.io";
import { Server } from "socket.io";
import {
    CreateRoomData,
    GameRoom,
    SocketActionTypes,
    User,
    MessageType,
} from "@repo/socket.io-types";
import { v4 as uu4id } from "uuid";

const app = express();

const rooms = new Map<string, GameRoom>(); //! TODO move to a database

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket: Socket) => {
    console.log("Number of connected sockets:", io.engine.clientsCount);

    socket.on(SocketActionTypes.create, (data: CreateRoomData) => {
        const roomId = uu4id();
        rooms.set(roomId, {
            roomId: roomId,
            roomName: data.roomName,
            roomPassword: data.roomPassword,
            roomGame: data.roomGame,
            roomDifficulty: data.roomDifficulty,
            isRoomPublic: data.isRoomPublic,
            roomHost: data.roomHost,
            roomUsers: [],
        });

        socket.emit(SocketActionTypes.create, roomId);
        socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values()));
    });

    socket.on(SocketActionTypes.join, async (roomId: string, user: User) => {
        const room = await rooms.get(roomId);
        if (user.userName === "") {
            user.userName = "Guest";
        }

        if (!room) {
            socket.emit(SocketActionTypes.joinFailed, "Room not found");
            return;
        }

        if (!room.isRoomPublic) {
            socket.emit(SocketActionTypes.roomPrivate);
            return;
        }

        if (!room.roomUsers.find((u) => u.userId === user.userId)) {
            room.roomUsers.push(user);
            socket.to(roomId).emit(SocketActionTypes.newJoined, user);
        }
        socket.join(roomId);
        socket.emit(SocketActionTypes.join, room); //! we should send the board and stuff like that
        socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values()));
    });

    socket.on(
        SocketActionTypes.joinWithPassword,
        (roomId: string, user: User, password: string) => {
            const room = rooms.get(roomId);
            if (!room) {
                socket.emit(SocketActionTypes.joinFailed);
                return;
            }

            if (room.roomPassword !== password) {
                socket.emit(SocketActionTypes.joinFailed, "Invalid password");
                return;
            }

            if (!room.roomUsers.find((u) => u.userId === user.userId)) {
                room.roomUsers.push(user);
                socket.to(roomId).emit(SocketActionTypes.newJoined, user);
            }
            socket.join(roomId);
            socket.emit(SocketActionTypes.join, room); //! we should send the board and stuff like that
            socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values()));
        }
    );

    socket.on(SocketActionTypes.message, (message: MessageType) => {
        socket.to(message.roomId).emit(SocketActionTypes.message, message);
    });

    socket.on(SocketActionTypes.leave, (roomId: string, user: User) => {
        console.log("leave", roomId, user);
        const room = rooms.get(roomId);
        if (!room) {
            socket.emit(SocketActionTypes.leaveFailed);
            return;
        }

        room.roomUsers = room.roomUsers.filter((u) => u.userId !== user.userId);

        if (room.roomUsers.length === 0) {
            rooms.delete(roomId);
        }

        socket.to(roomId).emit(SocketActionTypes.leave, user);
        socket.leave(roomId);
        socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values()));
    });

    socket.on(SocketActionTypes.askRooms, () => {
        socket.emit(SocketActionTypes.askRooms, Array.from(rooms.values()));
    });

    socket.on("disconnect", () => console.log("-", socket.id));
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
