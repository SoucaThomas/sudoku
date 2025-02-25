import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MessageType, GameRoom, Board, MovementActions } from "@repo/socket.io-types";
import { create } from "zustand";
import { startStop, makeMove, clearBoard } from "../actions/room";
import { User } from "../../auth";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
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
            const newUsers = state.room.users.filter((u) => u.id !== user.id);
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
                room: { ...state.room, roomUsers: [...(state.room?.users || []), user] },
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
    setClientBoard: (grid: string) => void;
    setServerBoard: (grid: string) => void;
    setBoard: (board: Board) => void;
    setMistakes: (mistakes: number) => void;
    setSelected: (selected: number | null) => void;
    handleMovement: (e: KeyboardEvent) => void;
    clearBoard: () => void;
}>((set) => ({
    boards: {
        clientBoard: "",
        serverBoard: "",
        mistakes: 0,
        score: 0,
    },
    selected: 0,
    sameValue: "",
    setClientBoard: (clientBoard: string) =>
        set((state) => ({ boards: { ...state.boards, clientBoard } })),
    setServerBoard: (serverBoard: string) =>
        set((state) => ({ boards: { ...state.boards, serverBoard } })),
    setBoard: (board: Board) => set((state) => ({ boards: { ...state.boards, ...board } })),
    setMistakes: (mistakes: number) => set((state) => ({ boards: { ...state.boards, mistakes } })),
    setSelected: (selected: number | null) => set({ selected }),
    handleMovement: async (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                useMovementStore.getState().addCommand(MovementActions.UP);
                break;
            case "ArrowDown":
                useMovementStore.getState().addCommand(MovementActions.DOWN);
                break;
            case "ArrowLeft":
                useMovementStore.getState().addCommand(MovementActions.LEFT);
                break;
            case "ArrowRight":
                useMovementStore.getState().addCommand(MovementActions.RIGHT);
                break;
        }
        if (e.key === "Backspace" || e.key === "Delete") {
            useMovementStore.getState().addCommand(MovementActions.DELETE);
        }

        if (e.key.match(/[1-9]/)) {
            useMovementStore.getState().addCommand(e.key as MovementActions);
        }
    },
    clearBoard: () => {
        clearBoard();
    },
}));

export const useMovementStore = create<{
    commands: MovementActions[];
    addCommand: (command: MovementActions) => void;
    proccesCommand: () => void;
}>((set) => ({
    commands: [] as MovementActions[],
    addCommand: (command: MovementActions) =>
        set((state) => ({
            commands: [...state.commands, command],
        })),
    proccesCommand: () => {
        const process = useMovementStore.getState().commands.pop();

        switch (process) {
            case MovementActions.UP:
                useBoardStore
                    .getState()
                    .setSelected(
                        (useBoardStore.getState().selected || 0) < 9
                            ? useBoardStore.getState().selected
                            : (useBoardStore.getState().selected || 0) - 9
                    );
                break;

            case MovementActions.DOWN:
                useBoardStore
                    .getState()
                    .setSelected(
                        useBoardStore.getState().selected !== null &&
                            (useBoardStore.getState().selected || 0) > 71
                            ? useBoardStore.getState().selected
                            : (useBoardStore.getState().selected || 0) + 9
                    );
                break;

            case MovementActions.LEFT:
                useBoardStore
                    .getState()
                    .setSelected(
                        ((useBoardStore.getState().selected !== null &&
                            useBoardStore.getState().selected) ||
                            0 % 9) === 0
                            ? useBoardStore.getState().selected
                            : (useBoardStore.getState().selected || 0) - 1
                    );
                break;

            case MovementActions.RIGHT:
                useBoardStore
                    .getState()
                    .setSelected(
                        useBoardStore.getState().selected !== null &&
                            (useBoardStore.getState().selected || 0) % 9 === 8
                            ? useBoardStore.getState().selected
                            : (useBoardStore.getState().selected || 0) + 1
                    );
                break;

            case MovementActions.DELETE:
                if (
                    useBoardStore.getState().boards.clientBoard[
                        useBoardStore.getState().selected || 0
                    ] === "0"
                )
                    break;
                if (
                    useBoardStore.getState().boards.serverBoard[
                        useBoardStore.getState().selected || 0
                    ] !== "0"
                )
                    break;
                makeMove(useBoardStore.getState().selected || 0, "0");
                break;

            default:
                if (process?.match(/[1-9]/)) {
                    if (
                        useBoardStore.getState().boards.clientBoard[
                            useBoardStore.getState().selected || 0
                        ] === process
                    )
                        break;
                    if (
                        useBoardStore.getState().boards.serverBoard[
                            useBoardStore.getState().selected || 0
                        ] !== "0"
                    )
                        break;
                    makeMove(useBoardStore.getState().selected || 0, process);
                }
                break;
        }

        return process;
    },
}));
