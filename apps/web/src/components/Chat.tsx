"use client";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Message } from "../components/Message";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

export default function Chat() {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        const mesage = {
            user: "user",
            message: message,
            time: new Date().toLocaleTimeString(),
        };

        setChat([...chat, mesage]);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center">
                <h1>Rooms</h1>
                <p>Players:</p>
            </div>
            <Separator />
            <div className="flex-1 overflow-y-auto">
                {/* Chat messages will go here */}
                {chat.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </div>
            <Separator />
            <div className="p-2 mt-2 flex items-center">
                <Input
                    placeholder="Type a message..."
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                />
                <Button variant="default" className="ml-2" onClick={sendMessage}>
                    <Send color="white" />
                </Button>
            </div>
        </div>
    );
}
