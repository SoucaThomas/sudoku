"use client";

import { useParams } from "next/navigation";
import { joinRoom } from "../../../actions/room";
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
import { useRoomStore } from "../../../lib/utils";

const Room = () => {
    const { toast } = useToast();
    const { id } = useParams() as { id: string };
    const { room, setRoom } = useRoomStore();
    const [isMounted, setIsMounted] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordResolve, setPasswordResolve] = useState<((value: string) => void) | null>(null);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
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
        <section className="w-5/6 md:w-3/4 max-w-7xl mx-auto my-10">
            <div className="h-12 w-full bg-zinc-400">tooltip</div>
            <div className="h-full md:grid md:grid-cols-6 md:grid-rows-6 lg:grid ">
                <div className="bg-red-500/20 m-2 max-md:h-1/2 md:row-span-3 md:col-span-4">
                    game
                </div>
                <div className="m-2 hidden md:block md:row-span-3 md:col-span-2">
                    <Chat />
                </div>
                <div className="bg-blue-400/20 m-2 h-1/5 md:hidden"> controls for mobile</div>
            </div>

            <Popover>
                <PopoverTrigger className="fixed bottom-4 right-4 z-10 border border-white p-3 md:hidden rounded-full shadow-lg">
                    <MessageCircleMore />
                </PopoverTrigger>
                <PopoverContent className="w-[80dvw] h-[60dvh]">
                    <Chat />
                </PopoverContent>
            </Popover>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                            className="bg-blue-500 text-white px-4 py-2 rounded"
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
