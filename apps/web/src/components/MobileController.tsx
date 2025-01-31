import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pencil, Trash } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useBoardStore, useMovementStore } from "../lib/utils";
import { MovementActions } from "@repo/socket.io-types";

export default function MobileController() {
    const { addCommand } = useMovementStore();
    const { clearBoard } = useBoardStore();

    return (
        <Card className="h-full w-full">
            <div className="overflow-hidden h-full w-full">
                <CardContent className="flex flex-col h-full p-3 w-full justify-between">
                    <div className="flex flex-row h-full p-3 w-full gap-2 justify-between">
                        <div className="aspect-square grid grid-cols-3 grid-rows-3">
                            <Button
                                variant="outline"
                                className="aspect-square col-start-2 h-full w-full flex justify-center items-center p-3"
                                onClick={() => addCommand(MovementActions.UP)}
                            >
                                <ChevronUp />
                            </Button>
                            <Button
                                variant="outline"
                                className="aspect-square row-start-2 col-start-1 h-full w-full flex justify-center items-center p-3"
                                onClick={() => addCommand(MovementActions.LEFT)}
                            >
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="aspect-square row-start-2 col-start-2 h-full w-full flex justify-center items-center p-3 text-lg"
                                onClick={() => addCommand(MovementActions.DELETE)}
                            >
                                0
                            </Button>
                            <Button
                                variant="outline"
                                className="aspect-square row-start-2 col-start-3 h-full w-full flex justify-center items-center p-3"
                                onClick={() => addCommand(MovementActions.RIGHT)}
                            >
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="aspect-square row-start-3 col-start-2 h-full w-full flex justify-center items-center p-3"
                                onClick={() => addCommand(MovementActions.DOWN)}
                            >
                                <ChevronDown />
                            </Button>
                        </div>
                        <div className="aspect-square grid grid-cols-3 grid-rows-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="aspect-square h-full w-full flex justify-center items-center p-4 m-0 text-lg"
                                    onClick={() => {
                                        const actionMap = [
                                            "ONE",
                                            "TWO",
                                            "THREE",
                                            "FOUR",
                                            "FIVE",
                                            "SIX",
                                            "SEVEN",
                                            "EIGHT",
                                            "NINE",
                                        ];
                                        addCommand(
                                            MovementActions[
                                                actionMap[i] as keyof typeof MovementActions
                                            ]
                                        );
                                    }}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-row h-full p-3 w-full justify-between gap-5">
                        <Button
                            variant="outline"
                            className="aspect-square w-full flex justify-center items-center"
                        >
                            <Pencil />
                        </Button>
                        <Button
                            variant="outline"
                            className="aspect-square w-full flex justify-center items-center"
                            onClick={() => {
                                clearBoard();
                            }}
                        >
                            <Trash />
                        </Button>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
