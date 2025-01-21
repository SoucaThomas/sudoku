"use client";

import { useParams } from "next/navigation";
import { joinRoom } from "../../../actions/room";
import { useToast } from "../../../hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Room = () => {
    const { toast } = useToast();
    const { id } = useParams() as { id: string };
    const [isMounted, setIsMounted] = useState(false); // Client-side check state
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true); // Ensure we're in the client-side context
    }, []);

    useEffect(() => {
        if (!isMounted && !router) return;

        joinRoom(id).catch((error) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Room join failed: ${error}`,
            });
            router.push("/");
        });
    }, []);

    return (
        <div>
            <h1>Room ID: {id}</h1>
        </div>
    );
};

export default Room;
