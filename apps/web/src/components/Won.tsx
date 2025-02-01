import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Stats from "./Stats";

export default function Won() {
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
