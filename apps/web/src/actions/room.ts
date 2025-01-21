import { CreateRoomData, SocketActionTypes, User } from "@repo/socket.io-types";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:4001");

export const createRoom = (data: CreateRoomData) => {
    const userId = localStorage.getItem("userId") || uuidv4();
    const userName = localStorage.getItem("userName") || "Host";

    const host = { userId: userId, userName: userName } as User;

    socket.emit(SocketActionTypes.create, { ...data, roomHost: host } as CreateRoomData);

    localStorage.setItem("userId", userId);

    socket.on("room created", (roomId: string) => {
        window.location.href = `/room/${roomId}`;
        // console.log("room created", roomId);
    });

    socket.on("room creation failed", (error: string) => {
        // toast({
        //     variant: "destructive",
        //     title: "Uh oh! Something went wrong.",
        //     description: `Room creation failed: ${error}`,
        // });
        console.error("room creation failed", error);
    });
};

// export const checkRoom = async (id: string) => {
//     try {
//         const response = await fetch(`${nodeUrl}/api/room/${id}`);
//         if (response.ok) {
//             const data = await response.json();
//             console.log(data);
//             if (data.error) return Error((data.error = data.message));
//         } else {
//             return Error("Failed to fetch room data");
//         }
//     } catch (error) {
//         return error;
//     }
// };

export const joinRoom = async (id: string) => {
    const response = new Promise((resolve, reject) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}") as User;
        socket.emit(SocketActionTypes.join, id, user);

        socket.on(SocketActionTypes.join, (room) => {
            console.log("joined room", room);
            resolve(room);
        });

        socket.on(SocketActionTypes.joinFailed, (error: string) => {
            console.error("room join failed", error);
            reject(error);
        });
    });

    return response;
};
