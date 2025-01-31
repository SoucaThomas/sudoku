"use client";

import PlayerLobby from "../components/PlayerLobby";
import OpenGames from "../components/OpenGames";
import { motion } from "framer-motion";

export default function HomePage() {
    return (
        <div className="my-10 h-4/5 w-5/6 gap-2 md:overflow-y-hidden md:grid md:h-4/5 md:grid-cols-6 md:grid-rows-6 lg:my-20 lg:grid lg:h-1/2 lg:grid-cols-8 lg:grid-rows-4 lg:gap-4">
            <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="order-1 mb-4 hidden h-full w-full bg-zinc-400 md:col-span-2 md:row-span-3 md:mb-0 md:block lg:col-span-3 lg:row-span-2"
            >
                LeaderBoard
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="order-2 h-3/4 w-full md:col-span-4 md:row-span-3 md:h-full lg:col-span-3 lg:row-span-6 mb-4 md:mb-0"
            >
                <PlayerLobby />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="order-3 h-1/2 md:h-full w-full md:col-span-4 md:row-span-2 lg:order-4 lg:col-span-3 lg:row-span-4"
            >
                <OpenGames />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="order-4 hidden h-full w-full bg-pink-400 md:col-span-2 md:row-span-2 md:block lg:order-3 lg:col-span-2 lg:row-span-6 lg:block"
            >
                stats/ad
            </motion.div>
        </div>
    );
}
