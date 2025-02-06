import express from "express";
import http from "http";
import cors from "cors";
import { Socket } from "socket.io";
import { Server } from "socket.io";
import {
    CreateRoomData,
    SocketActionTypes,
    User,
    MessageType,
    Status,
    GameRoom,
} from "@repo/socket.io-types";

import { getSudoku } from "sudoku-gen";
import {
    create,
    getRoom,
    addUserToRoom,
    removeUserFromRoom,
    getRooms,
    // deleteRoom,
    startStop,
    getBoard,
    updateBoard,
    updateRoom,
} from "@repo/database";

const app = express();

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket: Socket) => {
    console.log("New connection", socket.id);

    socket.on(SocketActionTypes.create, async (data: CreateRoomData) => {
        const validDifficulties = ["easy", "medium", "hard", "expert"];
        const difficulty = validDifficulties.includes(data.roomDifficulty)
            ? data.roomDifficulty
            : "easy";
        const sudoku = getSudoku(difficulty);
        const boards = {
            serverBoard: sudoku.puzzle
                .split("")
                .map((v) => (v === "-" ? "0" : v))
                .join(""),
            clientBoard: sudoku.puzzle
                .split("")
                .map((v) => (v === "-" ? "0" : v))
                .join(""),
            solution: sudoku.solution,
            mistakes: 0,
            score: 0,
        };

        const room = await create({ data, boards });

        console.log("Created room", room.roomId);

        socket.emit(SocketActionTypes.create, room.roomId);
        // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
    });

    socket.on(SocketActionTypes.join, async (roomId: string, user: User) => {
        console.log("Join request", roomId, user.id);
        const room = await getRoom(roomId);

        if (!room) {
            console.log("Room not found");
            socket.emit(SocketActionTypes.joinFailed, "Room not found");
            return;
        }
        if (!room.isRoomPublic) {
            console.log("Room is private");
            socket.emit(SocketActionTypes.roomPrivate);
            return;
        }
        socket.join(roomId);
        await addUserToRoom({ userId: user.id, roomId: roomId });
        console.log("Successfully joined room", roomId);
        socket.emit(SocketActionTypes.join, room);
        // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
    });

    socket.on(
        SocketActionTypes.joinWithPassword,
        async (roomId: string, user: User, password: string) => {
            console.log("Join with password request", roomId, user.id);
            const room = await getRoom(roomId);

            if (!room) {
                console.log("Room not found");
                socket.emit(SocketActionTypes.joinFailed, "Room not found");
                return;
            }
            if (room.roomPassword !== password) {
                console.log("Invalid password");
                socket.emit(SocketActionTypes.joinFailed, "Invalid password");
                return;
            }
            socket.join(roomId);
            await addUserToRoom({ userId: user.id, roomId: roomId });
            console.log("Successfully joined room with password", room);
            socket.emit(SocketActionTypes.join, room);
            // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
        }
    );
    socket.on(SocketActionTypes.message, (message: MessageType) => {
        socket.to(message.roomId).emit(SocketActionTypes.message, message);
    });

    //! we wont get user because the provider will be null when we are getting the request
    // socket.on(SocketActionTypes.leave, async (roomId: string, user: User) => {
    //     console.log(roomId, user);

    //     const room = await getRoom(roomId);
    //     if (!room) {
    //         socket.emit(SocketActionTypes.leaveFailed);
    //         return;
    //     }
    //     let newRoom = await removeUserFromRoom({ roomId, user: user });

    //     console.log("User left", newRoom, user.id);
    //     // if (newRoom?.roomUsers.length === 0) {
    //     //     await deleteRoom(roomId);
    //     // }
    //     socket.to(roomId).emit(SocketActionTypes.leave, user);
    //     socket.leave(roomId);
    //     socket.emit(SocketActionTypes.update, room);
    //     // socket.broadcast.emit(SocketActionTypes.roomUpdate, Array.from(rooms.values())); //! TODO CALL THE PRISMA FUNCTION TO GET ALL THE ROOMS
    // });

    socket.on(SocketActionTypes.askRooms, async () => {
        let rooms = await getRooms();
        socket.emit(SocketActionTypes.askRooms, Array.from(rooms.values()));
    });

    socket.on(SocketActionTypes.startStop, async (roomId: string) => {
        const room = await getRoom(roomId);
        if (!room) {
            return;
        }
        console.log("Start/Stop", room.isPlaying);
        const date = new Date();
        room.isPlaying = !room.isPlaying;
        if (room.isPlaying) {
            room.lastTimeStarted = date;
        } else {
            room.totalPlayTime += date.getTime() - room.lastTimeStarted.getTime();
        }
        const newRoom = await startStop(roomId, room);
        socket.to(roomId).emit(SocketActionTypes.update, newRoom);
        socket.emit(SocketActionTypes.update, newRoom);
    });

    socket.on(SocketActionTypes.getBoard, async (roomId: string) => {
        const room = await getRoom(roomId);
        if (!room) return;

        console.log("GET BOARD", room.boardId);

        const board = await getBoard(room.boardId ?? "");

        console.log(board);

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
                board.clientBoard =
                    board.clientBoard.substring(0, index) +
                    value +
                    board.clientBoard.substring(index + 1);
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
                board.clientBoard =
                    board.clientBoard.substring(0, index) +
                    value +
                    board.clientBoard.substring(index + 1);
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
                await updateRoom(room as GameRoom);
                io.to(roomId).emit(SocketActionTypes.update, room);
                io.in(roomId).emit(SocketActionTypes.lose, {
                    serverBoard: board.serverBoard,
                    clientBoard: board.clientBoard,
                    mistakes: board.mistakes,
                    score: board.score,
                });
            }
            if (board.clientBoard === board.solution) {
                room.isPlaying = false;
                const date = new Date();
                room.totalPlayTime += date.getTime() - room.lastTimeStarted.getTime();
                room.status = Status.WON;
                await updateRoom(room as GameRoom);
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
