import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { User, MessageType, Colors, GameRoom, Board } from "@repo/socket.io-types";
import { create } from "zustand";
import { startStop, makeMove } from "../actions/room";
import { response } from "express";

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
    boards: Board;
    selected: number | null;
    sameValue: string;
    setClientBoard: (grid: string[]) => void;
    setServerBoard: (grid: string[]) => void;
    addMistake: () => void;
    setSelected: (selected: number | null) => void;
    handleMovement: (e: KeyboardEvent) => void;
}>((set) => ({
    boards: {
        clientBoard: [],
        serverBoard: [],
        mistakes: 0,
    },
    selected: 0,
    sameValue: "",
    setClientBoard: (clientBoard: string[]) =>
        set((state) => ({ boards: { ...state.boards, clientBoard } })),
    setServerBoard: (serverBoard: string[]) =>
        set((state) => ({ boards: { ...state.boards, serverBoard } })),
    addMistake: () =>
        set((state) => ({ boards: { ...state.boards, mistakes: state.boards.mistakes + 1 } })),
    setSelected: (selected: number | null) => set({ selected }),
    handleMovement: async (e: KeyboardEvent) => {
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
                if (state.boards.clientBoard[state.selected] === "0") return state;
                if (state.boards.serverBoard[state.selected] !== "0") return state;
                makeMove(state.selected, "0");
                return state;
            });
        }

        if (e.key.match(/[1-9]/)) {
            set((state) => {
                if (state.boards.clientBoard[state.selected] === e.key) return state;
                if (state.boards.serverBoard[state.selected] !== "0") return state;
                makeMove(state.selected, e.key);
                return state;
            });
        }
    },
}));
