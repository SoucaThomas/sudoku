import { Card, CardContent } from "./ui/card";
import { useState, useEffect } from "react";

export default function Game() {
    const board =
        "048301560360008090910670003020000935509010200670020010004002107090100008150834029";

    const grid = board.split("").map((cell) => parseInt(cell));
    const [selected, setSelected] = useState<number | null>(null);

    const sameValue = "bg-yellow-800/10";
    const sameRowCol = "bg-blue-200/30";
    const sameSquare = "bg-purple-400/20";

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
                <div className="aspect-square w-full max-w-md grid grid-cols-9 grid-rows-9 gap-1">
                    {grid.map((cell, index) => (
                        <Card
                            key={index}
                            className={`aspect-square w-full h-full text-center text-2xl font-bold rounded-none
                              ${selected === index ? "border-white border" : ""}
                              ${grid[selected] === grid[index] && grid[selected] != 0 ? sameValue : ""}
                              ${Math.floor(selected / 9) === Math.floor(index / 9) && selected !== null ? sameRowCol : ""}
                              ${selected !== null && selected % 9 === index % 9 ? sameRowCol : ""}
                              ${Math.floor(selected / 27) === Math.floor(index / 27) && Math.floor((selected % 9) / 3) === Math.floor((index % 9) / 3) ? sameSquare : ""}
                              `}
                            style={{ cursor: "pointer" }}
                            data-cell={index}
                            onClick={() => setSelected(index)}
                        >
                            {cell === 0 ? "" : cell}
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
