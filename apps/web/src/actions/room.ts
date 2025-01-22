import { CreateRoomData, GameRoom, SocketActionTypes, User } from "@repo/socket.io-types";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "../hooks/use-toast";

const socket = io("http://localhost:4001");

socket.on(SocketActionTypes.newJoined, (user: User) => {
    console.log("new user joined", user);
});

export const createRoom = (data: CreateRoomData, toast: ReturnType<typeof useToast>["toast"]) => {
    const userId = localStorage.getItem("userId") || uuidv4();
    const userName = localStorage.getItem("userName") || "Host";

    const host = { userId: userId, userName: userName } as User;

    socket.emit(SocketActionTypes.create, { ...data, roomHost: host } as CreateRoomData);

    localStorage.setItem("userId", userId);

    socket.on(SocketActionTypes.create, (roomId: string) => {
        window.location.href = `/room/${roomId}`;
        socket.off(SocketActionTypes.create);
    });

    socket.on("room creation failed", (error: string) => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Room creation failed: ${error}`,
        });
    });
};

export const joinRoom = async (id: string, requestPassword: () => Promise<string>) => {
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
