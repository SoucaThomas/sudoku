import { User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AnimatedProgress } from "./ui/animatedProgress";
import ColorSelectorDialog from "./ColorSelectorDialog";

export default function UserStats() {
    const { user } = useAuth();
    return (
        <Card className="w-full h-full overflow-auto">
            <CardContent className="flex lg:flex-row md:flex-col gap-2 p-4">
                <div className="flex flex-col justify-center items-center bg-red mt-6">
                    <Avatar className="w-12 h-12 transition-transform">
                        <div className="w-full h-full flex items-center justify-center">
                            {user?.image ? (
                                <AvatarImage src={user.image} alt="User Avatar" />
                            ) : (
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            )}
                        </div>
                    </Avatar>
                </div>
                <div className="flex flex-col w-full md:mt-0 lg:mt-4">
                    <ColorSelectorDialog classname="self-end" />
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-2xl">{user?.name}</p>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-row justify-center xl:justify-between items-center">
                            <h1 className="text-lg font-mono">Level {1}</h1>
                            <p className="text-sm font-mono max-xl:hidden block">36/105</p>
                        </div>
                        <AnimatedProgress value={30} delay={4} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
