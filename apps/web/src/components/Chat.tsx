"use client";

import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Message } from "../components/Message";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { MessageType } from "@repo/socket.io-types";
import { useChatStore, useRoomStore } from "../lib/utils";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
    socketMessage,
    listenForMessages,
    closeMessageListener,
    listenForUsers,
    closeUserListener,
} from "../actions/room";
import { useAuth } from "../hooks/AuthProvider";

export default function Chat() {
    const [message, setMessage] = useState<string>("");
    const { user } = useAuth();
    const { messages, addMessage } = useChatStore();
    const { room, addUser, removeUser } = useRoomStore();

    useEffect(() => {
        listenForMessages(addMessage);
        listenForUsers(room, addUser, removeUser, addMessage);

        return () => {
            closeMessageListener();
            closeUserListener();
        };
    }, []);

    useEffect(() => {
        console.log(room.users);
    }, [room]);

    const sendMessage = () => {
        if (message === "") {
            return;
        }

        const messageObject = {
            user: user,
            message: message,
            time: new Date().toLocaleTimeString(),
            messageType: "message",
            roomId: room.roomId,
        } as MessageType;
        addMessage(messageObject);
        socketMessage(messageObject);
        setMessage("");
    };

    return (
        <Card className="flex flex-col h-full">
            <div className="flex justify-between items-center p-3">
                <h1>Rooms</h1>
                <p>Players: {room && room?.users ? room.users.length : "error"}</p>
            </div>
            <Separator />
            <ScrollArea className="flex-1 overflow-y-auto flex p-3 flex-col" id="chat-container">
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </ScrollArea>
            <Separator />
            <div className="p-4  flex items-center">
                <Input
                    placeholder="Type a message..."
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                    value={message}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                <Button variant="default" className="ml-2" onClick={sendMessage} type="submit">
                    <Send color="white" />
                </Button>
            </div>
        </Card>
    );
}
