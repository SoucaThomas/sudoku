import React from "react";
import { Button } from "./ui/button";

interface SettingsComponentProps {
    icon: React.FC;
    text: string;
    buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    onClick: () => void;
}

export default function settingsComponent({
    icon,
    text,
    buttonVariant,
    onClick,
}: SettingsComponentProps) {
    return (
        <div className="w-full p-2 flex flex-row justify-between items-center">
            <p>{text}</p>
            <Button
                variant={buttonVariant ? buttonVariant : "outline"}
                onClick={() => {
                    onClick();
                }}
            >
                {React.createElement(icon)}
            </Button>
        </div>
    );
}
