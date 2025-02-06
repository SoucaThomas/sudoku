import { User } from "lucide-react";
import { useAuth } from "../hooks/AuthProvider";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ColorSelectorDialog from "./ColorSelectorDialog";
import { Skeleton } from "./ui/skeleton";
import { Progress } from "./ui/progress";
import GradientText from "./ui/GradientText";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function UserStats() {
    const { loading, user } = useAuth();
    const router = useRouter();

    return (
        <Card className="w-full h-full overflow-hidden flex flex-col">
            <CardContent className="flex flex-row gap-2 p-4">
                <div className="flex flex-col justify-center items-center bg-red mt-6">
                    <Avatar className="w-12 h-12 transition-transform">
                        <div className="w-full h-full flex items-center justify-center">
                            {loading ? (
                                <Skeleton className="h-12 w-12 rounded-full"></Skeleton>
                            ) : (
                                <>
                                    {user?.image ? (
                                        <AvatarImage src={user.image} alt="User Avatar" />
                                    ) : (
                                        <AvatarFallback>
                                            <User />
                                        </AvatarFallback>
                                    )}
                                </>
                            )}
                        </div>
                    </Avatar>
                </div>
                <div className="flex flex-col w-full md:mt-0 lg:mt-4">
                    <ColorSelectorDialog classname="self-end" />
                    <div className="flex flex-row w-full justify-between">
                        {loading ? (
                            <Skeleton className="h-6 w-[80%]"></Skeleton>
                        ) : (
                            <p className="text-2xl max-xl:text-lg">
                                {user?.name && user.name.length > 10
                                    ? `${user.name.slice(0, 10)}...`
                                    : (user?.name ?? "")}
                            </p>
                        )}
                    </div>
                    <div className="w-full">
                        <div className="flex flex-row justify-center xl:justify-between items-center">
                            {loading ? (
                                <Skeleton className="h-6 my-2 w-16"></Skeleton>
                            ) : (
                                <h1 className="text-lg font-mono flex gap-2 items-center">
                                    Level <GradientText>{user?.level ?? 0}</GradientText>
                                </h1>
                            )}
                            {loading ? (
                                <Skeleton className="h-4 my-2 w-12 max-xl:hidden block"></Skeleton>
                            ) : (
                                <p className="text-sm font-mono max-xl:hidden block">
                                    {user?.experiance ?? 0}
                                </p>
                            )}
                        </div>
                        {loading ? (
                            <Skeleton className="h-4 w-full"></Skeleton>
                        ) : (
                            <Progress value={user?.experiance ?? 10} />
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="mt-auto self-end">
                {!loading && (
                    <div className="flex flex-col items-center w-full">
                        <p className="text-lg mb-4 text-center">You are not logged in.</p>
                        <Button
                            onClick={() => {
                                router.push("/sign-up");
                            }}
                        >
                            Create Account!
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
