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
    Board,
    Status,
} from "@repo/socket.io-types";
import { v4 as uu4id } from "uuid";
import { getSudoku } from "sudoku-gen";

const app = express();

const rooms = new Map<string, GameRoom>(); //! TODO move to a database
const boards = new Map<string, Board>();

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

            isPlaying: false,
            totalPlayTime: 0,
            lastTimeStarted: new Date(),
            status: Status.PLAYING,
        });

        const validDifficulties = ["easy", "medium", "hard", "expert"];
        const difficulty = validDifficulties.includes(data.roomDifficulty)
            ? data.roomDifficulty
            : "easy";
        const sudoku = getSudoku(difficulty);

        boards.set(roomId, {
            serverBoard: sudoku.puzzle.split("").map((v) => (v === "-" ? "0" : v)),
            clientBoard: sudoku.puzzle.split("").map((v) => (v === "-" ? "0" : v)),
            solution: sudoku.solution.split(""),
            pencilMarks: [],
            mistakes: 0,
            score: 0,
        });

        socket.emit(SocketActionTypes.create, roomId);
        socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values()));
    });

    socket.on(SocketActionTypes.join, (roomId: string, user: User) => {
        const room = rooms.get(roomId);
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

        const roomData = {
            ...room,
            roomHost: room.roomHost?.userId === user.userId ? room.roomHost : undefined,
        };

        socket.emit(SocketActionTypes.join, roomData);
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

            const roomData = {
                ...room,
                roomHost: room.roomHost?.userId === user.userId ? room.roomHost : undefined,
            };

            socket.join(roomId);
            socket.emit(SocketActionTypes.join, room);
            socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values()));
        }
    );

    socket.on(SocketActionTypes.message, (message: MessageType) => {
        socket.to(message.roomId).emit(SocketActionTypes.message, message);
    });

    socket.on(SocketActionTypes.leave, (roomId: string, user: User) => {
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
        socket.emit(SocketActionTypes.update, room);
        socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values()));
    });

    socket.on(SocketActionTypes.askRooms, () => {
        socket.emit(SocketActionTypes.askRooms, Array.from(rooms.values()));
    });

    socket.on(SocketActionTypes.startStop, (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room) {
            return;
        }

        room.isPlaying = !room.isPlaying;
        const date = new Date();
        if (room.isPlaying) {
            room.lastTimeStarted = date;
        } else {
            room.totalPlayTime += date.getTime() - room.lastTimeStarted.getTime();
        }
        rooms.set(roomId, room);

        socket.to(roomId).emit(SocketActionTypes.update, room);
        socket.emit(SocketActionTypes.update, room);
    });

    socket.on(SocketActionTypes.getBoard, (roomId: string) => {
        const board = boards.get(roomId);
        if (!board) return;

        socket.emit(SocketActionTypes.getBoard, {
            serverBoard: board?.serverBoard,
            clientBoard: board?.clientBoard,
        });
    });

    socket.on(
        SocketActionTypes.move,
        ({ roomId, index, value }: { roomId: string; index: number; value: string }) => {
            const room = rooms.get(roomId);
            const board = boards.get(roomId);
            if (!room || !board) {
                return;
            }

            if (board.serverBoard[index] !== "0") return;

            if (value === "0") {
                board.clientBoard[index] = value;
                const { solution, ...boardWithoutSolution } = board;
                io.in(roomId).emit(SocketActionTypes.move, {
                    ...boardWithoutSolution,
                });
            }
            if (board.solution && board.solution[index] !== value) {
                board.mistakes++;
                board.score -= 100;
                const { solution, ...boardWithoutSolution } = board;
                io.in(roomId).emit(SocketActionTypes.badMove, {
                    ...boardWithoutSolution,
                });
            } else {
                board.clientBoard[index] = value;
                board.score += 150;
                const { solution, ...boardWithoutSolution } = board;
                io.in(roomId).emit(SocketActionTypes.goodMove, {
                    ...boardWithoutSolution,
                });
            }

            if (board.mistakes >= 3) {
                console.log("LOSE");

                room.isPlaying = false;
                const date = new Date();
                room.totalPlayTime += date.getTime() - room.lastTimeStarted.getTime();
                room.status = Status.LOST;
                rooms.set(roomId, room);

                io.to(roomId).emit(SocketActionTypes.update, room);
                io.in(roomId).emit(SocketActionTypes.lose, {
                    serverBoard: board.serverBoard,
                    clientBoard: board.clientBoard,
                    mistakes: board.mistakes,
                    score: board.score,
                });
            }

            if (board.clientBoard.join("") === board.solution?.join("")) {
                room.isPlaying = false;
                const date = new Date();
                room.totalPlayTime += date.getTime() - room.lastTimeStarted.getTime();
                room.status = Status.WON;
                rooms.set(roomId, room);

                io.to(roomId).emit(SocketActionTypes.update, room);
                io.in(roomId).emit(SocketActionTypes.win, {
                    serverBoard: board.serverBoard,
                    clientBoard: board.clientBoard,
                    mistakes: board.mistakes,
                    score: board.score,
                });
            }
        }
    );

    socket.on(SocketActionTypes.clear, ({ roomId }: { roomId: string }) => {
        console.log(roomId);
        const board = boards.get(roomId);
        if (!board) return;

        board.clientBoard = board.serverBoard;
        board.mistakes = 0;
        board.score = 0;
        io.in(roomId).emit(SocketActionTypes.clear, {
            serverBoard: board.serverBoard,
            clientBoard: board.clientBoard,
            mistakes: board.mistakes,
            score: board.score,
        });
    });

    socket.on(SocketActionTypes.updateUser, ({ roomId, user }: { roomId: string; user: User }) => {
        console.log(roomId, user);
        socket.emit(SocketActionTypes.updateUser);
    });

    socket.on("disconnect", () => console.log("-", socket.id));
});

const port = process.env.PORT || 4001;
server.listen(port, () => console.log(`Listening on port ${port}`));
