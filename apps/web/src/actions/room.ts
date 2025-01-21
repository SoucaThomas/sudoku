import { CreateRoomData, SocketActionTypes, User } from "@repo/socket.io-types";
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

    socket.on("room created", (roomId: string) => {
        window.location.href = `/room/${roomId}`;
    });

    socket.on("room creation failed", (error: string) => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Room creation failed: ${error}`,
        });
    });
};

export const joinRoom = async (id: string) => {
    const response = new Promise((resolve, reject) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}") as User;
        socket.emit(SocketActionTypes.join, id, user);

        socket.on(SocketActionTypes.join, (room) => {
            console.log("joined room", room);
            resolve(room);
        });

        socket.on(SocketActionTypes.joinFailed, (error: string) => {
            reject(error);
        });
    });

    return response;
};
