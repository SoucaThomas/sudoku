import { CircleUser } from "lucide-react";
import { Card } from "./ui/card";
import { ColorValues, MessageType } from "@repo/socket.io-types";
import { useTheme } from "next-themes";

interface MessageProps {
    message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
    const { theme } = useTheme();
    return (
        <>
            {message.messageType === "message" ? (
                <Card className="p-4 flex flex-col mt-3">
                    <div className="flex items-start">
                        <CircleUser className="h-6 w-6 flex-shrink-0" />
                        <div className="ml-2 flex flex-col">
                            <p
                                className="font-medium"
                                style={{
                                    color:
                                        theme === "dark"
                                            ? ColorValues[message.user.color]?.dark
                                            : ColorValues[message.user.color]?.light,
                                }}
                            >
                                {message.user?.userName ? message.user.userName : "Guest"}
                            </p>
                            <p className="text-sm break-words max-w-full whitespace-pre-wrap">
                                {message.message}
                            </p>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="p-2 mt-2 -mb-1">
                    <p>
                        <span
                            style={{
                                color:
                                    theme === "dark"
                                        ? ColorValues[message.user.color]?.dark
                                        : ColorValues[message.user.color]?.light,
                            }}
                        >
                            {message.user.userName ? message.user.userName : "New User"}
                        </span>{" "}
                        {message.message}
                    </p>
                </Card>
            )}
        </>
    );
};

export default Message;
