import { Card, CardContent } from "./ui/card";
import { useState, useEffect } from "react";
import { useBoardStore, useRoomStore } from "../lib/utils";
import { getBoard, listenForMoves } from "../actions/room";

export default function Game() {
    const [isLoading, setIsLoading] = useState(true);
    const { clientBoard, selected, setSelected, handleMovement, setClientBoard, setServerBoard } =
        useBoardStore();
    const { room } = useRoomStore();
    const sameValue = "bg-[hsl(var(--primary))]/70";
    const selectedCell = "bg-[hsl(var(--primary))]/90 border-2 border-[hsl(var(--foreground))]";
    const sameRowCol = "bg-[hsl(var(--primary))]/30";

    useEffect(() => {}, [clientBoard]);

    useEffect(() => {
        if (!room.roomId) return;

        getBoard(room.roomId).then(
            ({ serverBoard, clientBoard }: { serverBoard: string[]; clientBoard: string[] }) => {
                setClientBoard(clientBoard);
                setServerBoard(serverBoard);
                listenForMoves(setClientBoard);

                if (clientBoard?.length > 0) setIsLoading(false);
            }
        );

        window.addEventListener("keydown", handleMovement, true);

        return () => {
            window.removeEventListener("keydown", handleMovement);
        };
    }, [room.roomId]);

    return (
        <Card className="w-full h-full">
            {isLoading ? (
                <h1>Loading</h1>
            ) : (
                <CardContent className="flex justify-center items-center h-full p-0 m-0">
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
                                            ${clientBoard[selected] === clientBoard[i] && clientBoard[selected] != "0" ? sameValue : ""}
                                            ${selected !== null && selected % 9 === i % 9 ? sameRowCol : ""}
                                            ${Math.floor(selected / 9) === Math.floor(i / 9) && selected !== null ? sameRowCol : ""}
                                            ${Math.floor(selected / 27) === Math.floor(i / 27) && Math.floor((selected % 9) / 3) === Math.floor((i % 9) / 3) && selected !== null ? sameRowCol : ""}
                                            ${selected === i ? selectedCell : ""}
                                        `}
                                            key={i}
                                            onClick={() => setSelected(i)}
                                        >
                                            {clientBoard[i] === "0" ? "" : clientBoard[i]}
                                        </Card>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
