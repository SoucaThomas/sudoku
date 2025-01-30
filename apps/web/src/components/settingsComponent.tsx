import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface SettingsComponentProps {
    icon: React.FC;
    text: string;
    buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    disabled?: boolean;
    onClick: () => void;
}

export default function settingsComponent({
    icon,
    text,
    buttonVariant,
    onClick,
    disabled,
}: SettingsComponentProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.4 }}
        >
            <Button
                variant={buttonVariant ? buttonVariant : "outline"}
                onClick={() => {
                    onClick();
                }}
                disabled={disabled}
                className="w-full m-1 flex flex-row justify-between items-center"
            >
                <p>{text}</p>

                {React.createElement(icon)}
            </Button>
        </motion.div>
    );
}
