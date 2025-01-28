import { Card, CardContent } from "./ui/card";
import { useState, useEffect } from "react";

export default function Game() {
    const board =
        "301086504046521070500000001400800002080347900009050038004090200008734090007208103";

    const grid = board.split("").map((cell) => parseInt(cell));
    const [selected, setSelected] = useState<number | null>(null);

    const sameValue = "bg-[hsl(var(--primary))]/60";
    const selectedCell = "bg-[hsl(var(--primary))]/90 border border-[hsl(var(--foreground))]";
    const sameRowCol = "bg-[hsl(var(--primary))]/30";

    const handleMovement = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                setSelected((prev) => (prev < 9 ? prev : prev - 9));
                break;
            case "ArrowDown":
                setSelected((prev) => (prev > 71 ? prev : prev + 9));
                break;
            case "ArrowLeft":
                setSelected((prev) => (prev % 9 === 0 ? prev : prev - 1));
                break;
            case "ArrowRight":
                setSelected((prev) => (prev % 9 === 8 ? prev : prev + 1));
                break;
        }
    };

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
                                            ${grid[selected] === grid[i] && grid[selected] != 0 ? sameValue : ""}
                                            ${selected !== null && selected % 9 === i % 9 ? sameRowCol : ""}
                                            ${Math.floor(selected / 9) === Math.floor(i / 9) && selected !== null ? sameRowCol : ""}
                                            ${Math.floor(selected / 27) === Math.floor(i / 27) && Math.floor((selected % 9) / 3) === Math.floor((i % 9) / 3) ? sameRowCol : ""}
                                            ${selected === i ? selectedCell : ""}
                                        `}
                                        key={i}
                                        onClick={() => {
                                            setSelected(i);
                                            console.log(selected);
                                        }}
                                    >
                                        {grid[i] === 0 ? "" : grid[i]}
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
