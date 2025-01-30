import { useRef, useState } from "react";
import { UserPen } from "lucide-react";
import { ColorValues, MessageType } from "@repo/socket.io-types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Message from "./Message";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { UserProvider } from "../lib/utils";
import { updateRoomUser } from "../actions/room";

interface ColorSelectorDialogProps {
    isDialogOpen?: boolean;
    setIsDialogOpen?: (isDialogOpen: boolean) => void;
}

export default function ColorSelectorDialog({
    isDialogOpen,
    setIsDialogOpen,
}: ColorSelectorDialogProps) {
    const user = new UserProvider().getUser();
    const { theme } = useTheme();
    const [refresh, setRefresh] = useState(0);
    const messageRef = useRef<HTMLDivElement>(null);

    const refreshMessage = () => {
        setRefresh((prev) => prev + 1);
    };

    const updateUser = (color: string) => {
        const updatedUser = {
            ...user,
            color: color,
        };

        new UserProvider().setUser(updatedUser);
        refreshMessage();

        updateRoomUser();
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
                <UserPen className="h-6 w-6" />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Profile</DialogTitle>
                <div ref={messageRef}>
                    <Message
                        message={
                            {
                                message: `Hello! I'm ${user?.userName}`,
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
                                    updateUser(color);
                                }}
                            ></Button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
