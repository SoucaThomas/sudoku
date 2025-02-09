import { ReactNode, useState } from "react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import OpenGames from "./OpenGames";
import { checkRoom } from "../actions/action";
import { useRouter } from "next/navigation";

interface JoinRoomProps {
    children: ReactNode;
    className?: string;
}

export default function JoinRoom({ children, className }: JoinRoomProps) {
    const [roomId, setRoomId] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const join = async () => {
        const room = await checkRoom(roomId);
        if (room) {
            router.push(`/room/${roomId}`);
        }
    };

    return (
        <div className={className}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="h-4/5 flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Join a game room</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Select a room to join or enter a room code to participate.
                    </DialogDescription>
                    <div className="flex flex-row gap-4">
                        <Input
                            placeholder="Enter code"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        ></Input>
                        <Button onClick={join}>Join!</Button>
                    </div>

                    <div className="h-full">
                        <OpenGames></OpenGames>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
