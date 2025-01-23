import {
    CreateRoomData,
    GameRoom,
    SocketActionTypes,
    User,
    MessageType,
} from "@repo/socket.io-types";
import { io, Socket } from "socket.io-client";
import { UserProvider } from "../lib/utils";

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

export const listenForMessages = (onMessage: (message: MessageType) => void) => {
    socket = getSocket();
    socket.on(SocketActionTypes.message, (message: MessageType) => {
        onMessage(message);
    });
};

export const closeMessageListener = () => {
    socket = getSocket();
    socket.off(SocketActionTypes.message);
};
