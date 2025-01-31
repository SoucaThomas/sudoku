import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Stats from "./Stats";

export default function Lose() {
    return (
        <Dialog open={true}>
            <DialogContent className="flex flex-col items-center justify-center select-none">
                <DialogTitle className="text-3xl items-center">Game Over! 😢</DialogTitle>

                <motion.h2
                    className="pt-2"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Oops! The puzzle remains unsolved.
                </motion.h2>
                <Stats />
                <DialogFooter className="flex flex-row items-center justify-center m-0 p-0 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        <Button onClick={() => {}}>Play again</Button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                    >
                        <Button
                            variant="outline"
                            onClick={() => {
                                window.location.href = "/";
                            }}
                        >
                            Take a break!
                        </Button>
                    </motion.div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
