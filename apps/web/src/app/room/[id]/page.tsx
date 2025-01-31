"use client";

import { useParams } from "next/navigation";
import { joinRoom, leaveRoom } from "../../../actions/room";
import { useToast } from "../../../hooks/use-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameRoom } from "@repo/socket.io-types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "../../../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { MessageCircleMore } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Chat from "../../../components/Chat";
import Game from "../../../components/Game";
import Tooltip from "../../../components/Tooltip";
import { useRoomStore } from "../../../lib/utils";
import { listenForGameUpdate, closeListenForGameUpdate } from "../../../actions/room";
import MobileController from "../../../components/MobileController";

const Room = () => {
    const { toast } = useToast();
    const { id } = useParams() as { id: string };
    const { setRoom } = useRoomStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordResolve, setPasswordResolve] = useState<((value: string) => void) | null>(null);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);

        listenForGameUpdate(setRoom);

        const handleBeforeUnload = () => {
            leaveRoom();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);

            closeListenForGameUpdate();
        };
    }, []);

    const requestPassword = () => {
        return new Promise<string>((resolve) => {
            setPasswordResolve(() => resolve);
            setDialogOpen(true);
        });
    };

    const handlePasswordSubmit = () => {
        if (passwordResolve) {
            passwordResolve(password);
            setPassword("");
            setDialogOpen(false);
        }
    };

    useEffect(() => {
        if (!isMounted || !router || !id || isJoining) return;

        setIsJoining(true);
        joinRoom(id, requestPassword)
            .then((room: GameRoom) => {
                setRoom(room);
                setIsJoining(false);
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `Room join failed: ${error}`,
                });
                if (error === "Invalid password") {
                    setIsJoining(false);
                } else {
                    router.push("/");
                }
            });
    }, [isMounted, router, id]);

    return (
        <section className="h-full w-5/6 md:w- max-w-7xl mx-auto">
            <div className="h-16 w-full mb-2">
                <Tooltip />
            </div>
            <div className="h-5/6 felx md:grid md:grid-cols-6 dgrid-rows-6 md:grid-rows-3 lg:grid ">
                <div className="max-md:h-3/5 mb-2 row-span-4 col-span-6 md:row-span-2 md:col-span-4 mr-1">
                    <Game />
                </div>
                <div className="mb-2 hidden md:block md:row-span-2 md:col-span-2 ml-1">
                    <Chat />
                </div>
                <div className="md:hidden row-span-2 col-span-6 order-2">
                    <MobileController />
                </div>
            </div>

            <Popover>
                <PopoverTrigger className="fixed bottom-4 right-4 z-10 border p-3 md:hidden rounded-full shadow-lg">
                    <MessageCircleMore />
                </PopoverTrigger>
                <PopoverContent className="w-[80dvw] h-[60dvh]">
                    <Chat />
                </PopoverContent>
            </Popover>

            <Dialog open={dialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Password</DialogTitle>
                    </DialogHeader>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-4 border rounded px-4 py-2 w-full"
                    />
                    <DialogFooter>
                        <Button
                            onClick={handlePasswordSubmit}
                            className="bg-[hsl(--var(primary))] text-white px-4 py-2 rounded"
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default Room;
