"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "./progress";

interface AnimatedProgressProps {
    value: number;
    className?: string;
    delay?: number;
}

export function AnimatedProgress({ value, className, delay = 0 }: AnimatedProgressProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(value), 100);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className={className}>
            <Progress value={progress} className="h-2" />
            <motion.div
                className="h-2 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 2 }}
                style={{
                    position: "relative",
                    top: "-8px",
                }}
            />
        </div>
    );
}
