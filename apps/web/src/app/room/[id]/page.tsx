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

const Room = () => {
    const { toast } = useToast();
    const { id } = useParams() as { id: string };
    const [isMounted, setIsMounted] = useState(false); // Client-side check state
    const [isJoining, setIsJoining] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordResolve, setPasswordResolve] = useState<((value: string) => void) | null>(null);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true); // Ensure we're in the client-side context
    }, []);

    // Function to request the password
    const requestPassword = () => {
        return new Promise<string>((resolve) => {
            setPasswordResolve(() => resolve); // Save the resolver
            setDialogOpen(true); // Open the dialog
        });
    };

    // Handle password submission
    const handlePasswordSubmit = () => {
        if (passwordResolve) {
            passwordResolve(password); // Resolve the promise with the password
            setPassword(""); // Clear the password field
            setDialogOpen(false); // Close the dialog
        }
    };

    useEffect(() => {
        if (!isMounted || !router || !id || isJoining) return;

        setIsJoining(true);
        joinRoom(id, requestPassword)
            .then((room: GameRoom) => {
                console.log("Successfully joined room:", room);
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
        <div>
            <h1>Room ID: {id}</h1>

            {/* Password Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Password</DialogTitle>
                    </DialogHeader>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-4 border rounded px-4 py-2 w-full"
                    />
                    <DialogFooter>
                        <button
                            onClick={handlePasswordSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Room;
