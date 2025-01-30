import {
    CreateRoomData,
    GameRoom,
    SocketActionTypes,
    User,
    MessageType,
} from "@repo/socket.io-types";
import { io, Socket } from "socket.io-client";
import { UserProvider, useBoardStore, useRoomStore } from "../lib/utils";

let socket: Socket;

const getSocket = () => {
    if (!socket) {
        socket = io("http://localhost:4001");
    }
    return socket;
};

export const createRoom = (data: CreateRoomData) => {
    const user = new UserProvider().user;
    socket = getSocket();

    return new Promise<string>((resolve, reject) => {
        socket.emit(SocketActionTypes.create, { ...data, roomHost: user } as CreateRoomData);

        socket.on(SocketActionTypes.create, (roomId: string) => {
            // window.location.href = `/room/${roomId}`;
            resolve(roomId);

            socket.off(SocketActionTypes.create);
        });

        socket.on(SocketActionTypes.createFailed, (error: string) => {
            reject(error);

            socket.off(SocketActionTypes.createFailed);
        });
    });
};

export const joinRoom = async (id: string, requestPassword: () => Promise<string>) => {
    socket = getSocket();
    return new Promise<GameRoom>((resolve, reject) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}") as User;

        socket.emit(SocketActionTypes.join, id, user);

        const onJoinSuccess = (room: GameRoom) => {
            cleanup();
            resolve(room);
        };

        const onRoomPrivate = async () => {
            cleanup();
            try {
                let passwordAccepted = false;

                while (!passwordAccepted) {
                    const password = await requestPassword();
                    socket.emit(SocketActionTypes.joinWithPassword, id, user, password);

                    const onPasswordAccepted = (room: GameRoom) => {
                        passwordAccepted = true;
                        onJoinSuccess(room);
                    };

                    const onPasswordRejected = (error: string) => {
                        reject(error);
                    };

                    socket.once(SocketActionTypes.join, onPasswordAccepted);
                    socket.once(SocketActionTypes.joinFailed, onPasswordRejected);

                    await new Promise<void>((resolve) => {
                        socket.once(SocketActionTypes.join, resolve);
                        socket.once(SocketActionTypes.joinFailed, resolve);
                    });

                    socket.off(SocketActionTypes.join, onPasswordAccepted);
                    socket.off(SocketActionTypes.joinFailed, onPasswordRejected);
                }
            } catch {
                console.error("Password required but not provided.");
                reject("Password required but not provided.");
            }
        };

        const onJoinFailed = (error: string) => {
            cleanup();
            reject(error);
        };

        socket.on(SocketActionTypes.join, onJoinSuccess);
        socket.on(SocketActionTypes.joinFailed, onJoinFailed);
        socket.on(SocketActionTypes.roomPrivate, onRoomPrivate);

        const cleanup = () => {
            socket.off(SocketActionTypes.join, onJoinSuccess);
            socket.off(SocketActionTypes.roomPrivate, onRoomPrivate);
            socket.off(SocketActionTypes.joinFailed, onJoinFailed);
        };
    });
};

export const socketMessage = (messageObject: MessageType) => {
    socket = getSocket();
    socket.emit(SocketActionTypes.message, messageObject);
};

export const listenForMessages = (addMessage: (message: MessageType) => void) => {
    socket = getSocket();
    socket.on(SocketActionTypes.message, (message: MessageType) => {
        addMessage(message);
    });

    socket.on(SocketActionTypes.join, () => {
        addMessage({
            user: { userName: "System" },
            message: "- Welcome to the chat!",
            time: new Date().toLocaleTimeString(),
            messageType: "system",
        } as MessageType);
    });
};

export const closeMessageListener = () => {
    socket = getSocket();
    socket.off(SocketActionTypes.message);
    socket.off(SocketActionTypes.join);
};

export const listenForUsers = (
    room: GameRoom,
    addUser: (newUser: User) => void,
    removeUser: (user: User) => void,
    addMessage: (message: MessageType) => void
) => {
    socket = getSocket();
    const handleNewUser = (newUser: User) => {
        addUser(newUser);
        const messageObject = {
            user: newUser,
            message: `joined`,
            time: new Date().toLocaleTimeString(),
            messageType: "system",
            roomId: room.roomId,
        } as MessageType;
        addMessage(messageObject);
    };

    const handleLeaveUser = (user: User) => {
        removeUser(user);
        const messageObject = {
            user: user,
            message: `left the room`,
            time: new Date().toLocaleTimeString(),
            messageType: "system",
            roomId: room.roomId,
        } as MessageType;
        addMessage(messageObject);
    };

    socket.on(SocketActionTypes.newJoined, handleNewUser);
    socket.on(SocketActionTypes.leave, handleLeaveUser);
};

export const closeUserListener = () => {
    socket = getSocket();
    socket.off(SocketActionTypes.newJoined);
    socket.off(SocketActionTypes.leave);
};

export const leaveRoom = () => {
    socket = getSocket();
    socket.emit(
        SocketActionTypes.leave,
        useRoomStore.getState().room.roomId,
        new UserProvider().user
    );
};

export const askRooms = () => {
    return new Promise<GameRoom[]>((resolve) => {
        socket = getSocket();

        socket.emit(SocketActionTypes.askRooms);

        socket.on(SocketActionTypes.askRooms, (rooms: GameRoom[]) => {
            resolve(rooms);

            socket.off(SocketActionTypes.askRooms);
        });
    });
};

export const listenForRooms = (setRooms: (room: GameRoom[]) => void) => {
    socket = getSocket();

    socket.on(SocketActionTypes.roomUpdate, (rooms: GameRoom[]) => {
        setRooms(rooms);
    });
};

export const closeListenForRooms = () => {
    socket = getSocket();
    socket.off(SocketActionTypes.roomUpdate);
};

export const startStop = (roomId: string) => {
    socket = getSocket();
    socket.emit(SocketActionTypes.startStop, roomId);
};

export const listenForGameUpdate = (setRoom: (room: GameRoom) => void) => {
    socket = getSocket();
    socket.on(SocketActionTypes.update, (room: GameRoom) => {
        setRoom(room);
    });
};

export const closeListenForGameUpdate = () => {
    socket = getSocket();
    socket.off(SocketActionTypes.update);
};

export const getBoard = async (roomId: string) => {
    socket = getSocket();
    return new Promise<{ serverBoard: string[]; clientBoard: string[] }>((resolve) => {
        socket.emit(SocketActionTypes.getBoard, roomId);

        socket.on(
            SocketActionTypes.getBoard,
            ({ serverBoard, clientBoard }: { serverBoard: string[]; clientBoard: string[] }) => {
                resolve({ serverBoard, clientBoard });

                socket.off(SocketActionTypes.getBoard);
            }
        );
    });
};

export const makeMove = async (index: number, value: string) => {
    socket = getSocket();

    socket.emit(SocketActionTypes.move, {
        roomId: useRoomStore.getState().room.roomId,
        index,
        value,
    });
};

export const listenForMoves = (setClientBoard, addMistake) => {
    //!handle off
    socket = getSocket();

    socket.on(SocketActionTypes.goodMove, (board: string[]) => {
        setClientBoard(board);
    });

    socket.on(SocketActionTypes.move, (board: string[]) => {
        setClientBoard(board);
    });

    socket.on(SocketActionTypes.badMove, () => {
        addMistake();
    });
};

export const closeListenForMoves = () => {
    socket = getSocket();

    socket.off(SocketActionTypes.goodMove);
    socket.off(SocketActionTypes.move);
    socket.off(SocketActionTypes.badMove);
};

export const clearBoard = () => {
    socket = getSocket();

    socket.emit(SocketActionTypes.clear, {
        roomId: useRoomStore.getState().room.roomId,
    });

    socket.on(SocketActionTypes.clear, (board: { serverBoard: string[]; mistakes: number }) => {
        useBoardStore.getState().setClientBoard(board.serverBoard);
        useBoardStore.getState().setMistakes(board.mistakes);

        socket.off(SocketActionTypes.clear);
    });
};

export const updateRoomUser = () => {
    socket = getSocket();

    const user = new UserProvider().user;
    const roomId = useRoomStore.getState().room.roomId;

    if (!roomId) return;

    socket.emit(SocketActionTypes.updateUser, { roomId, user });
};
