import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { User, MessageType, Colors } from "@repo/socket.io-types";
import { create } from "zustand";

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

        localStorage.setItem("user", JSON.stringify({ userId, userName, color }));
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
