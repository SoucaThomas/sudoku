import { CircleUser, Clock } from "lucide-react";
import { useBoardStore, useRoomStore } from "../lib/utils";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ColorValues } from "@repo/socket.io-types";
import Stats from "./Stats";

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
                <Stats />
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
