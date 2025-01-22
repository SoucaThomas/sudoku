import express from "express";
import http from "http";
import cors from "cors";
import { Socket } from "socket.io";
import { Server } from "socket.io";
import { CreateRoomData, GameRoom, SocketActionTypes, User } from "@repo/socket.io-types";
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
    console.log("+", socket.id);

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

        console.log("Room created", {
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
    });

    socket.on(SocketActionTypes.join, async (roomId: string, user: User) => {
        const room = await rooms.get(roomId);
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
        console.log(socket.rooms);
    });

    socket.on(
        SocketActionTypes.joinWithPassword,
        (roomId: string, user: User, password: string) => {
            const room = rooms.get(roomId);
            if (!room) {
                socket.emit(SocketActionTypes.joinFailed);
                return;
            }

            console.log("Joining room with password", room?.roomPassword, password);
            if (room.roomPassword !== password) {
                socket.emit(SocketActionTypes.joinFailed, "Invalid password");
                return;
            }

            if (!room.roomUsers.find((u) => u.userId === user.userId)) {
                room.roomUsers.push(user);
                socket.join(roomId);
                socket.to(roomId).emit(SocketActionTypes.newJoined, user);
                console.log(socket.rooms);
            }
        }
    );

    socket.on("disconnect", () => console.log("-", socket.id));
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
