import { ReactNode, useState } from "react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import MySelector from "./ui/mySelector";
import { Button } from "./ui/button";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { GameTypes, GameDifficulties, CreateRoomData } from "@repo/socket.io-types";
import { createRoom } from "../actions/room";
import { useAuth } from "../hooks/AuthProvider";

interface CreateRoomDialogProps {
    children: ReactNode;
    className?: string;
}

export default function CreateRoomDialog({ children, className }: CreateRoomDialogProps) {
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [isRoomPublic, setIsRoomPublic] = useState(true);
    const [gameType, setGameType] = useState(GameTypes.SUDOKU);
    const [gameDifficulty, setGameDifficulty] = useState(GameDifficulties.EASY);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();

    return (
        <div className={className}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a game room</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Fill in the details below to create a new game room.
                    </DialogDescription>
                    <div>
                        <form>
                            <div className="mt-3">
                                <DialogTitle>Room Name</DialogTitle>
                                <div className="mt-3 flex flex-row justify-between gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter a room name"
                                        onChange={(e) => setRoomName(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsRoomPublic(!isRoomPublic);
                                        }}
                                        type="button"
                                    >
                                        <LockKeyhole className={!isRoomPublic ? "hidden" : ""} />
                                        <LockKeyholeOpen
                                            className={!isRoomPublic ? "" : "hidden"}
                                        />
                                    </Button>
                                </div>
                            </div>

                            <div className={`mt-3`}>
                                <DialogTitle>Room Password</DialogTitle>
                                <div className="relative">
                                    <Input
                                        type={"password"}
                                        className="mt-3"
                                        placeholder="Enter a room password"
                                        onChange={(e) => setRoomPassword(e.target.value)}
                                        disabled={isRoomPublic}
                                        autoComplete="off"
                                    />
                                    {isRoomPublic && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 select-none">
                                            <span className="text-sm text-gray-500">
                                                Room is public, no password needed
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:gap-0">
                                <div>
                                    <DialogTitle>Game Type</DialogTitle>
                                    <MySelector
                                        display={GameTypes}
                                        onUpdate={(e) => {
                                            setGameType(e as GameTypes);
                                        }}
                                        className="mt-2"
                                        defaultValue={GameTypes.SUDOKU}
                                    />
                                </div>
                                <div>
                                    <DialogTitle>Game Difficulty</DialogTitle>
                                    <MySelector
                                        display={GameDifficulties}
                                        onUpdate={(e) => {
                                            setGameDifficulty(e as GameDifficulties);
                                        }}
                                        className="mt-2"
                                        defaultValue={GameDifficulties.EASY}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button
                            variant="default"
                            onClick={(e) => {
                                e.preventDefault();

                                if (!roomName) {
                                    toast({
                                        variant: "destructive",
                                        title: "Uh oh! Something went wrong.",
                                        description: "You must enter a room name.",
                                    });
                                    return;
                                }

                                if (!isRoomPublic && !roomPassword) {
                                    toast({
                                        variant: "destructive",
                                        title: "Uh oh! Something went wrong.",
                                        description:
                                            "You must enter a room password for a private game.",
                                    });
                                    return;
                                }
                                if (user) {
                                    createRoom(
                                        {
                                            roomName: roomName,
                                            roomPassword: roomPassword,
                                            roomGame: gameType,
                                            roomDifficulty: gameDifficulty,
                                            isRoomPublic: isRoomPublic,
                                            roomHost: user,
                                        } as CreateRoomData,
                                        user
                                    )
                                        .then((roomId: string) => {
                                            window.location.href = `/room/${roomId}`;
                                        })
                                        .catch((error: string) => {
                                            toast({
                                                variant: "destructive",
                                                title: "Uh oh! Something went wrong.",
                                                description: `Room creation failed: ${error}`,
                                            });
                                        });
                                } else {
                                    toast({
                                        variant: "destructive",
                                        title: "Uh oh! Something went wrong.",
                                        description: "User is not authenticated.",
                                    });
                                }

                                setRoomName("");
                                setRoomPassword("");
                                setIsRoomPublic(false);
                                setGameDifficulty(GameDifficulties.EASY);
                                setGameType(GameTypes.SUDOKU);
                                setIsDialogOpen(false);
                            }}
                        >
                            Create Room
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
