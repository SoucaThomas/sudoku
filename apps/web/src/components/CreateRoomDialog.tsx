import { ReactNode, useState } from "react";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import MySelector from "./ui/mySelector";
import { Button } from "./ui/button";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import {
    GameTypes,
    GameDifficulties,
    CreateRoomData,
    SocketActionTypes,
} from "@repo/socket.io-types";
import io from "socket.io-client";
import { revalidatePath } from "next/cache";

const socket = io("http://localhost:4001", {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd",
    },
});

interface CreateRoomDialogProps {
    children: ReactNode;
    className?: string;
}

export default function CreateRoomDialog({ children, className }: CreateRoomDialogProps) {
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [privateGame, setPrivateGame] = useState(false);
    const [gameType, setGameType] = useState(GameTypes.SUDOKU);
    const [gameDifficulty, setGameDifficulty] = useState(GameDifficulties.EASY);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const createRoom = (data: CreateRoomData) => {
        socket.emit(SocketActionTypes.create, {
            roomName: data.name,
            roomPassword: data.password,
            privateGame: !data.public,
            gameType: data.type,
            gameDifficulty: data.difficulty,
        });

        socket.on("room created", (roomId: string) => {
            window.location.href = `/room/${roomId}`;
        });

        socket.on("room creation failed", (error: string) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Room creation failed: ${error}`,
            });
        });
    };

    return (
        <div className={className}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a game room</DialogTitle>
                    </DialogHeader>
                    <div>
                        <form>
                            <div className="mt-3">
                                <h1>Room Name</h1>
                                <div className="mt-3 flex flex-row justify-between gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter a room name"
                                        onChange={(e) => setRoomName(e.target.value)}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => setPrivateGame(!privateGame)}
                                        type="button"
                                    >
                                        <LockKeyhole className={privateGame ? "hidden" : ""} />
                                        <LockKeyholeOpen className={!privateGame ? "hidden" : ""} />
                                    </Button>
                                </div>
                            </div>

                            <div className={`mt-3 ${privateGame ? "" : "hidden"}`}>
                                <DialogTitle>Room Password</DialogTitle>
                                <Input
                                    type={"password"}
                                    className="mt-3"
                                    placeholder="Enter a room password"
                                    onChange={(e) => setRoomPassword(e.target.value)}
                                />
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

                                if (privateGame && !roomPassword) {
                                    toast({
                                        variant: "destructive",
                                        title: "Uh oh! Something went wrong.",
                                        description:
                                            "You must enter a room password for a private game.",
                                    });
                                    return;
                                }

                                const data: CreateRoomData = {
                                    name: roomName,
                                    password: roomPassword,
                                    public: !privateGame,
                                    type: gameType,
                                    difficulty: gameDifficulty,
                                };
                                createRoom(data);

                                setRoomName("");
                                setRoomPassword("");
                                setPrivateGame(false);
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
