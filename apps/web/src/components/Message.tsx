import { CircleUser } from "lucide-react";

export const Message = (message: any) => {
    return (
        <div className="p-4 border flex items-center">
            <CircleUser className="h-6" />
            <p className="ml-4 text-sm break-words">{message.message.message}</p>
        </div>
    );
};

export default Message;
