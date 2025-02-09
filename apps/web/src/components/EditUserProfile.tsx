import { useRef, useState } from "react";
import { UserPen } from "lucide-react";
import { ColorValues, MessageType } from "@repo/socket.io-types";
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import Message from "./Message";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "../hooks/AuthProvider";
import { type User } from "../../auth";
import { Input } from "./ui/input";
import { z } from "zod";

interface EditUserProfileProps {
    isDialogOpen?: boolean;
    className?: string;
    setIsDialogOpen?: (isDialogOpen: boolean) => void;
}

const zodSchema = z.object({
    name: z.string(),
    color: z.string(),
});

export default function EditUserProfile({
    isDialogOpen,
    setIsDialogOpen,
    className,
}: EditUserProfileProps) {
    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState(user?.name);
    const [selectedColor, setSelectedColor] = useState(user?.color);
    const { theme } = useTheme();
    const messageRef = useRef<HTMLDivElement>(null);

    const saveUser = () => {
        const input = { name: username, color: selectedColor };
        const userInput = zodSchema.safeParse(input);

        if (!userInput.success) {
            console.error(userInput.error);
            return;
        }

        const updatedUser = {
            ...user,
            name: userInput.data.name,
            color: userInput.data.color,
        } as User;

        updateUser(updatedUser as User);
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(isOpen) => {
                if (setIsDialogOpen) {
                    setIsDialogOpen(isOpen);
                }
            }}
        >
            <DialogTrigger asChild>
                <UserPen className={`h-6 w-6 ${className}`} />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Profile</DialogTitle>

                <h1>Username</h1>
                <Input
                    disabled={!!user?.isAnonymous && true}
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />

                <h1 className="-mb-3 ">User Color</h1>
                <div ref={messageRef}>
                    <Message
                        message={
                            {
                                message: `Hello! I'm ${user?.name ?? "Guest"}`,
                                user: user,
                            } as MessageType
                        }
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {Object.keys(ColorValues).map((color, index) => {
                        return (
                            <Button
                                key={index}
                                className="w-12 h-12"
                                style={{
                                    backgroundColor:
                                        theme === "dark"
                                            ? ColorValues[color].dark
                                            : ColorValues[color].light,
                                }}
                                onClick={() => {
                                    setSelectedColor(color);
                                }}
                            ></Button>
                        );
                    })}
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            saveUser();
                        }}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
