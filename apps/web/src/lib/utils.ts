import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { User, MessageType } from "@repo/socket.io-types";
import { BehaviorSubject } from "rxjs";

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

        localStorage.setItem("user", JSON.stringify({ userId, userName }));
    }
}

export class ChatProvider {
    private chatSubject = new BehaviorSubject<MessageType[]>([]);
    chat$ = this.chatSubject.asObservable();

    constructor() {
        this.chatSubject.next([]);
    }

    public addMessage(message: MessageType) {
        const currentChat = this.chatSubject.getValue();
        this.chatSubject.next([...currentChat, message]);
    }
}

import React from "react";

export const useChatScroll = <T>(dep: T): React.MutableRefObject<HTMLDivElement> => {
    const ref = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dep]);
    return ref;
};
