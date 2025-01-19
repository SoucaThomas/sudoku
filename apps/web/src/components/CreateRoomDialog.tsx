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
import { GameDifficulties, GameTypes } from "../lib/utils";

interface CreateRoomDialogProps {
    children: ReactNode;
    className?: string;
    createRoom: (
        roomName: string,
        roomPassword: string,
        privateGame: boolean,
        gameType: GameTypes,
        gameDifficulty: GameDifficulties
    ) => void;
}

export default function CreateRoomDialog({
    children,
    className,
    createRoom,
}: CreateRoomDialogProps) {
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [privateGame, setPrivateGame] = useState(false);
    const [gameType, setGameType] = useState(GameTypes.SUDOKU);
    const [gameDifficulty, setGameDifficulty] = useState(GameDifficulties.EASY);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { toast } = useToast();

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

                                createRoom(
                                    roomName,
                                    roomPassword,
                                    privateGame,
                                    gameType,
                                    gameDifficulty
                                );
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
