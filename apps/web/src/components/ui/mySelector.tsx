"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

interface MySelectorProps {
    display: Record<string, string>;
    onUpdate?: (e: string) => void;
    className?: string;
    defaultValue?: string;
}

export default function MySelector({
    display,
    onUpdate,
    className,
    defaultValue,
}: MySelectorProps) {
    const [selected, setSelected] = useState<number>(
        defaultValue ? Object.keys(display).findIndex((key) => display[key] === defaultValue) : -1
    );
    const { theme } = useTheme();

    return (
        <div className={className}>
            <ul className="flex w-fit flex-row rounded-md border border-gray-200 dark:border-gray-800">
                {Object.keys(display).map((key, index) => (
                    <li
                        key={key}
                        onClick={() => {
                            setSelected(index);
                            onUpdate?.(key);
                        }}
                        tabIndex={0}
                        className={`border-grey-800 hover:bg-primary/20 p-2 ${selected === index ? "bg-primary hover:bg-primary" : ""} ${index === 0 ? "rounded-l-md" : ""} ${index === Object.keys(display).length - 1 ? "rounded-r-md" : ""} ${index !== Object.keys(display).length - 1 ? "border-r-2" : ""}`}
                    >
                        <p
                            className={`leading-7 [&:not(:first-child)]:mt-6 ${theme === "dark" ? "text-white" : selected === index ? "text-white" : "text-black"}`}
                        >
                            {display[key]}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
