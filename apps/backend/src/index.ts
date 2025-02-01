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

import { getSudoku } from "sudoku-gen";
import {
    create,
    getRoom,
    addUserToRoom,
    removeUserFromRoom,
    deleteRoom,
    getRooms,
    updateRoom,
    getBoard,
    updateBoard,
} from "@repo/database";

const app = express();

// const rooms = new Map<string, GameRoom>(); //! TODO move to a database
// const boards = new Map<string, Board>();

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket: Socket) => {
    console.log("Number of connected sockets:", io.engine.clientsCount);

    socket.on(SocketActionTypes.create, async (data: CreateRoomData) => {
        const validDifficulties = ["easy", "medium", "hard", "expert"];
        const difficulty = validDifficulties.includes(data.roomDifficulty)
            ? data.roomDifficulty
            : "easy";
        const sudoku = getSudoku(difficulty);

        const boards = {
            serverBoard: sudoku.puzzle.split("").map((v) => (v === "-" ? "0" : v)),
            clientBoard: sudoku.puzzle.split("").map((v) => (v === "-" ? "0" : v)),
            solution: sudoku.solution.split(""),
            mistakes: 0,
            score: 0,
        };

        const room = await create({ data, boards });

        socket.emit(SocketActionTypes.create, room.roomId);

        // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
    });

    socket.on(SocketActionTypes.join, async (roomId: string, user: User) => {
        const room = await getRoom(roomId);

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

        socket.join(roomId);
        const r = await addUserToRoom(roomId, user.userId); //! TODO Anonymous user

        socket.emit(SocketActionTypes.join, room);
        // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
    });

    socket.on(
        SocketActionTypes.joinWithPassword,
        async (roomId: string, user: User, password: string) => {
            const room = await getRoom(roomId);
            if (!room) {
                socket.emit(SocketActionTypes.joinFailed);
                return;
            }

            if (room.roomPassword !== password) {
                socket.emit(SocketActionTypes.joinFailed, "Invalid password");
                return;
            }

            const roomData = {
                ...room,
                roomHost: room.roomHostId === user.userId ? room.roomHostId : undefined,
            };

            socket.join(roomId);
            socket.emit(SocketActionTypes.join, room);
            // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
        }
    );

    socket.on(SocketActionTypes.message, (message: MessageType) => {
        socket.to(message.roomId).emit(SocketActionTypes.message, message);
    });

    socket.on(SocketActionTypes.leave, async (roomId: string, user: User) => {
        const room = await getRoom(roomId);
        if (!room) {
            socket.emit(SocketActionTypes.leaveFailed);
            return;
        }

        let newRoom = await removeUserFromRoom({ roomId, userId: user.userId });

        if (newRoom?.roomUsers.length === 0) {
            await deleteRoom(roomId);
        }

        socket.to(roomId).emit(SocketActionTypes.leave, user);
        socket.leave(roomId);
        socket.emit(SocketActionTypes.update, room);
        // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
    });

    socket.on(SocketActionTypes.askRooms, async () => {
        let rooms = await getRooms();
        socket.emit(SocketActionTypes.askRooms, Array.from(rooms.values()));
    });

    socket.on(SocketActionTypes.startStop, async (roomId: string) => {
        const room = await getRoom(roomId);
        if (!room) {
            return;
        }

        const date = new Date();

        room.isPlaying = !room.isPlaying;
        if (room.isPlaying) {
            room.lastTimeStarted = date;
        } else {
            room.totalPlayTime += date.getTime() - room.lastTimeStarted.getTime();
        }
        const newRoom = await updateRoom(roomId, room);

        socket.to(roomId).emit(SocketActionTypes.update, newRoom);
        socket.emit(SocketActionTypes.update, newRoom);
    });

    socket.on(SocketActionTypes.getBoard, async (roomId: string) => {
        const room = await getRoom(roomId);
        if (!room) return;

        const board = await getBoard(room.boardId ?? "");
        if (!board) return;

        socket.emit(SocketActionTypes.getBoard, {
            serverBoard: board?.serverBoard,
            clientBoard: board?.clientBoard,
        });
    });

    socket.on(
        SocketActionTypes.move,
        async ({ roomId, index, value }: { roomId: string; index: number; value: string }) => {
            const room = await getRoom(roomId);
            const board = await getBoard(room?.boardId ?? "");

            if (!room || !board) {
                return;
            }

            if (board.serverBoard[index] !== "0") return;

            if (value === "0") {
                board.clientBoard[index] = value;
                await updateBoard(room.boardId ?? "", board);
                const { solution, ...boardWithoutSolution } = board;
                io.in(roomId).emit(SocketActionTypes.move, {
                    ...boardWithoutSolution,
                });
            } else if (board.solution && board.solution[index] !== value) {
                board.mistakes++;
                board.score -= 100;
                await updateBoard(room.boardId ?? "", board);
                const { solution, ...boardWithoutSolution } = board;
                io.in(roomId).emit(SocketActionTypes.badMove, {
                    ...boardWithoutSolution,
                });
            } else {
                board.clientBoard[index] = value;
                board.score += 150;
                await updateBoard(room.boardId ?? "", board);
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

                await updateRoom(roomId, room);
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

                await updateRoom(roomId, room);
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

    socket.on(SocketActionTypes.clear, async ({ roomId }: { roomId: string }) => {
        const room = await getRoom(roomId);
        const board = await getBoard(room?.boardId ?? "");
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
