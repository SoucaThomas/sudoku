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
        <Button
            variant={buttonVariant ? buttonVariant : "outline"}
            onClick={() => {
                onClick();
            }}
            className="w-full m-1 flex flex-row justify-between items-center"
        >
            <p>{text}</p>

            {React.createElement(icon)}
        </Button>
    );
}
