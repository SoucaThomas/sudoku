import express from "express";
import http from "http";
import cors from "cors";
import { Socket } from "socket.io";
import { Server } from "socket.io";
import { CreateRoomData, SocketActionTypes } from "@repo/socket.io-types";

const app = express();
const rooms = new Map<string, CreateRoomData>(); //! TODO move to a database

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
        if (rooms.has(socket.id)) {
            socket.emit(
                SocketActionTypes.createFailed,
                "You have already created a room. Try joining it instead."
            );
            return;
        }

        rooms.set(socket.id, data);
        console.log(rooms);
        socket.emit("room created", socket.id);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
