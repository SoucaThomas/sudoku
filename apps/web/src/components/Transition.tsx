"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Transition({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="align-center flex h-full w-full justify-center"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
