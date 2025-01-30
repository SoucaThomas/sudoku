import { CircleUser, Clock } from "lucide-react";
import { useBoardStore, useRoomStore } from "../lib/utils";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ColorValues } from "@repo/socket.io-types";

export default function Won() {
    const { room } = useRoomStore();
    const { boards } = useBoardStore();
    const { theme } = useTheme();

    return (
        <Dialog open={true}>
            <DialogContent className="flex flex-col items-center justify-center select-none">
                <DialogTitle className="text-3xl items-center">🎉 Puzzle Solved! 🎉</DialogTitle>

                <motion.h2
                    className="pt-2"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Great teamwork! You completed the Sudoku!
                </motion.h2>
                <div className="grid grid-cols-2 gap-4 h-1/2 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="w-full h-full flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <CardContent className="flex flex-col pt-4 gap-2">
                                    <motion.p
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.55 }}
                                    >
                                        👥 Players: {room.roomUsers.length}
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className="flex flex-row items-center gap-2"
                                    >
                                        <Clock size={16} />
                                        Play time:{" "}
                                        <span className="font-bold">
                                            {(room.totalPlayTime !== undefined &&
                                                (room.totalPlayTime >= 3600000
                                                    ? new Date(room.totalPlayTime)
                                                          ?.toISOString()
                                                          .substr(11, 8)
                                                    : new Date(room.totalPlayTime)
                                                          ?.toISOString()
                                                          .substr(14, 5))) ||
                                                "00:00"}
                                        </span>
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.65 }}
                                    >
                                        ❌ Mistakes: {boards.mistakes}
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.7 }}
                                    >
                                        🏆 Score: {boards.score}
                                    </motion.p>

                                    <Button className="mt-4" onClick={() => {}}>
                                        Share your score!
                                    </Button>
                                </CardContent>
                            </motion.div>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="w-full h-full flex flex-col">
                            <CardContent className="flex flex-col pt-4">
                                {room.roomUsers.slice(0, 4).map((user, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 25 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.75 + index * 0.1 }}
                                    >
                                        <Card className="mb-2">
                                            <CardContent className="flex flex-row items-center m-0 p-2 pl-3 gap-2">
                                                <div className="flex items-start">
                                                    <CircleUser className="h-6 w-6 flex-shrink-0" />
                                                    <div className="ml-2 flex flex-col">
                                                        <p
                                                            className="font-medium"
                                                            style={{
                                                                color:
                                                                    theme === "dark"
                                                                        ? ColorValues[user.color]
                                                                              ?.dark
                                                                        : ColorValues[user.color]
                                                                              ?.light,
                                                            }}
                                                        >
                                                            {user.userName
                                                                ? user.userName
                                                                : "Guest"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                <DialogFooter>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        <Button onClick={() => (window.location.href = "/")}>Play again</Button>
                    </motion.div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
