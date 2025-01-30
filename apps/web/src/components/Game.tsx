import { Card, CardContent, CardHeader } from "./ui/card";
import { useState, useEffect } from "react";
import { useBoardStore, useRoomStore } from "../lib/utils";
import { getBoard, listenForMoves, startStop } from "../actions/room";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";

export default function Game() {
    const [isLoading, setIsLoading] = useState(true);
    const {
        boards,
        selected,
        setSelected,
        handleMovement,
        setClientBoard,
        setServerBoard,
        addMistake,
    } = useBoardStore();
    const { room } = useRoomStore();
    const sameValue = "bg-[hsl(var(--primary))]/70";
    const selectedCell = "bg-[hsl(var(--primary))]/90 border-2 border-[hsl(var(--foreground))]";
    const sameRowCol = "bg-[hsl(var(--primary))]/30";

    useEffect(() => {
        const roomId = window.location.pathname.split("/").pop();
        getBoard(roomId).then(
            ({ serverBoard, clientBoard }: { serverBoard: string[]; clientBoard: string[] }) => {
                setClientBoard(clientBoard);
                setServerBoard(serverBoard);
                listenForMoves(setClientBoard, addMistake);

                if (clientBoard?.length > 0) setIsLoading(false);
            }
        );

        window.addEventListener("keydown", handleMovement, true);

        return () => {
            window.removeEventListener("keydown", handleMovement);
        };
    }, []);

    return (
        <Card className="w-full h-full">
            <CardContent className="flex justify-center items-center h-full p-0 m-0">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full p-0 m-0">
                        <Spinner size="lg" className="bg-black dark:bg-white" />
                    </div>
                ) : room.isPlaying ? (
                    <div className="aspect-square w-full max-w-md grid grid-cols-3 grid-rows-3">
                        {Array.from({ length: 9 }).map((_, box) => (
                            <div
                                className="w-full h-full border border-[hsl(var(--foreground))] grid grid-cols-3 grid-rows-3 text-center text-2xl font-bold"
                                key={box}
                            >
                                {Array.from({ length: 9 }).map((_, index) => {
                                    const i =
                                        Math.floor(box / 3) * 27 +
                                        (box % 3) * 3 +
                                        Math.floor(index / 3) * 9 +
                                        (index % 3);
                                    return (
                                        <Card
                                            className={`rounded-none select-none 
                                            border border-[hsl(var(--foreground))]/30
                                            ${boards.clientBoard[selected] === boards.clientBoard[i] && boards.clientBoard[selected] != "0" ? sameValue : ""}
                                            ${selected !== null && selected % 9 === i % 9 ? sameRowCol : ""}
                                            ${Math.floor(selected / 9) === Math.floor(i / 9) && selected !== null ? sameRowCol : ""}
                                            ${Math.floor(selected / 27) === Math.floor(i / 27) && Math.floor((selected % 9) / 3) === Math.floor((i % 9) / 3) && selected !== null ? sameRowCol : ""}
                                            ${selected === i ? selectedCell : ""}
                                        `}
                                            key={i}
                                            onClick={() => setSelected(i)}
                                            onMouseEnter={() => setSelected(i)}
                                        >
                                            {boards.clientBoard[i] === "0"
                                                ? ""
                                                : boards.clientBoard[i]}
                                        </Card>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="h-full w-full flex items-center justify-center flex-col"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <CardHeader className="">Game is stopped</CardHeader>

                        <Button
                            variant="outline"
                            onClick={() => {
                                startStop(room.roomId);
                            }}
                        >
                            Start Game
                        </Button>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
