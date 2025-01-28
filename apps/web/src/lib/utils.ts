import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { User, MessageType, Colors, GameRoom } from "@repo/socket.io-types";
import { create } from "zustand";
import { startStop } from "../actions/room";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export class UserProvider {
    user: User;

    constructor(user?: User) {
        if (typeof localStorage !== "undefined" && localStorage.getItem("user") !== null) {
            this.user = JSON.parse(localStorage.getItem("user") as string) as User;
        } else {
            this.createUser();
        }
        if (user) {
            this.user = user;
        }
    }

    public getUser(): User {
        return this.user;
    }

    public setUser(user: User) {
        this.user = user;
        localStorage.setItem("user", JSON.stringify(user));
    }

    public createUser() {
        console.log("Creating user");
        const userId = uuidv4();
        const userName = "";
        const colorValues = Object.values(Colors);
        const color = colorValues[Math.floor(Math.random() * colorValues.length)];

        if (typeof localStorage !== "undefined") {
            localStorage.setItem(
                "user",
                JSON.stringify({ userId, userName, color, roomUsers: [] })
            );
        }
    }
}

export const useChatStore = create<{
    messages: MessageType[];
    addMessage: (newMessage: MessageType) => void;
}>((set) => ({
    messages: [] as MessageType[],
    addMessage: (newMessage: MessageType) =>
        set((state) => ({ messages: [...state.messages, newMessage] })),
}));

export const useRoomStore = create<{
    room: GameRoom;
    setRoom: (room: GameRoom) => void;
    removeUser: (user: User) => void;
    addUser: (user: User) => void;
    startStopGame: () => void;
}>((set) => ({
    isPlaying: false,
    room: {} as GameRoom,
    setRoom: (room: GameRoom) => {
        set((state) => {
            return { ...state, room };
        });
    },
    removeUser: (user: User) => {
        console.log("remove");
        set((state) => {
            const newUsers = state.room.roomUsers.filter((u) => u.userId !== user.userId);
            return {
                ...state,
                room: { ...state.room, roomUsers: newUsers },
            };
        });
    },
    addUser: (user: User) => {
        set((state) => {
            return {
                ...state,
                room: { ...state.room, roomUsers: [...(state.room?.roomUsers || []), user] },
            };
        });
    },
    startStopGame: () => {
        set((state) => {
            startStop(state.room.roomId);
            return { ...state, room: { ...state.room, isPlaying: !state.room.isPlaying } };
        });
    },
}));

export const useDiscoverStore = create<{
    rooms: GameRoom[];
    setRooms: (rooms: GameRoom[]) => void;
    addRoom: (room: GameRoom) => void;
}>((set) => ({
    rooms: [] as GameRoom[],
    setRooms: (rooms: GameRoom[]) => {
        set((state) => {
            return { ...state, rooms };
        });
    },
    addRoom: (room: GameRoom) => {
        set((state) => {
            return { ...state, rooms: [...state.rooms, room] };
        });
    },
}));

export const useBoardStore = create<{
    serverBoard: string;
    grid: string[];
    selected: number | null;
    sameValue: string;
    selectedCell: string;
    sameRowCol: string;
    setGrid: (grid: string[]) => void;
    setSelected: (selected: number | null) => void;
    handleMovement: (e: KeyboardEvent) => void;
}>((set) => ({
    serverBoard:
        "096200831300084070000603040600000000001409003003560900002740096507190084964802000",
    grid: "096200831300084070000603040600000000001409003003560900002740096507190084964802000".split(
        ""
    ),
    selected: null,
    sameValue: "",
    selectedCell: "",
    sameRowCol: "",
    setGrid: (grid: string[]) => set({ grid }),
    setSelected: (selected: number | null) => set({ selected }),
    handleMovement: (e: KeyboardEvent) => {
        //! TODO make this more generic (so it should be callable for the mobile movement)
        switch (e.key) {
            case "ArrowUp":
                set((state) => ({
                    selected:
                        state.selected !== null && state.selected < 9
                            ? state.selected
                            : state.selected - 9,
                }));
                break;
            case "ArrowDown":
                set((state) => ({
                    selected:
                        state.selected !== null && state.selected > 71
                            ? state.selected
                            : state.selected + 9,
                }));
                break;
            case "ArrowLeft":
                set((state) => ({
                    selected:
                        state.selected !== null && state.selected % 9 === 0
                            ? state.selected
                            : state.selected - 1,
                }));
                break;
            case "ArrowRight":
                set((state) => ({
                    selected:
                        state.selected !== null && state.selected % 9 === 8
                            ? state.selected
                            : state.selected + 1,
                }));
                break;
        }
        if (e.key === "Backspace" || e.key === "Delete") {
            set((state) => {
                if (state.selected !== null) {
                    state.grid[state.selected] = "0";
                }
                return { grid: state.grid };
            });
        }

        if (e.key.match(/[1-9]/)) {
            set((state) => {
                if (state.selected !== null && state.serverBoard[state.selected] === "0") {
                    state.grid[state.selected] = e.key;
                }
                return { grid: state.grid };
            });
        }
    },
}));
