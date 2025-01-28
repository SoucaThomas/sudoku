import { Card, CardContent } from "./ui/card";
import { useEffect } from "react";
import { useBoardStore } from "../lib/utils";

export default function Game() {
    const { grid, selected, setGrid, setSelected, handleMovement } = useBoardStore();

    const sameValue = "bg-[hsl(var(--primary))]/70";
    const selectedCell = "bg-[hsl(var(--primary))]/90 border-2 border-[hsl(var(--foreground))]";
    const sameRowCol = "bg-[hsl(var(--primary))]/30";

    useEffect(() => {
        console.log(grid);
    }, [grid]);

    useEffect(() => {
        window.addEventListener("keydown", handleMovement, true);

        return () => {
            window.removeEventListener("keydown", handleMovement);
        };
    }, []);

    return (
        <Card className="w-full h-full">
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
                                            ${grid[selected] === grid[i] && grid[selected] != "0" ? sameValue : ""}
                                            ${selected !== null && selected % 9 === i % 9 ? sameRowCol : ""}
                                            ${Math.floor(selected / 9) === Math.floor(i / 9) && selected !== null ? sameRowCol : ""}
                                            ${Math.floor(selected / 27) === Math.floor(i / 27) && Math.floor((selected % 9) / 3) === Math.floor((i % 9) / 3) && selected !== null ? sameRowCol : ""}
                                            ${selected === i ? selectedCell : ""}
                                        `}
                                        key={i}
                                        onClick={() => setSelected(i)}
                                    >
                                        {grid[i] === "0" ? "" : grid[i]}
                                    </Card>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
