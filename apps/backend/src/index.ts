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
    console.log("New client connected");

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

        socket.emit("room created", roomId);
    });

    socket.on(SocketActionTypes.join, async (roomId: string, user: User) => {
        console.log("Joining room", roomId);
        const room = await rooms.get(roomId);
        if (!room) {
            socket.emit(SocketActionTypes.joinFailed, "Room not found");
            return;
        }

        if (!room.roomUsers.find((u) => u.userId === user.userId)) {
            room.roomUsers.push(user);
            socket.to(roomId).emit(SocketActionTypes.newJoined, user);
        }
        socket.join(roomId);
        socket.emit(SocketActionTypes.join); //! we should send the board and stuff like that
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
