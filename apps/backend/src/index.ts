import express from "express";
import http from "http";
import cors from "cors";
import { Socket } from "socket.io";
import { Server } from "socket.io";
import { CreateRoomData, GameRoom, SocketActionTypes } from "@repo/socket.io-types";

const app = express();

const rooms = new Map<string, GameRoom>(); //! TODO move to a database

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    socket.on(SocketActionTypes.create, (data: CreateRoomData) => {
        const roomData = {
            roomId: socket.id,
            roomName: data.name,
            roomPassword: data.password,
            roomGame: data.type,
            roomDifficulty: data.difficulty,

            isRoomPublic: data.public,
            roomHost: data.hostId,
            roomUsers: [],
        };
        rooms.set(socket.id, roomData);
        socket.emit("room created", socket.id);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/api/room/:id", (req, res) => {
    const roomId = req.params.id as string;
    const room = rooms.get(roomId);
    console.log(roomId);
    if (room) {
        res.status(200).send(room);
    } else {
        res.status(200).send({ error: "Room not found" });
    }
});
