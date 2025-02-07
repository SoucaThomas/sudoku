import { levelExperiance } from "@repo/socket.io-types";
import { prisma } from "./client";

type User = {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
    isAnonymous?: boolean | null | undefined;
    gamesPlayed: number;
    totalScore: number;
    level: number;
    experiance: number;
    color: string;
};

export const updateUser = ({
    user,
    score,
    totalPlayTime,
    experiance,
}: {
    user: User;
    score: number;
    totalPlayTime: number;
    experiance: number;
}) => {
    if ((user.experiance || 0) + experiance >= levelExperiance(user.level)) {
        return prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                gamesPlayed: user.gamesPlayed + 1,
                totalScore: user.totalScore + score,
                experiance: (user.experiance || 0) + experiance - levelExperiance(user.level),
                level: user.level + 1,
            },
        });
    } else {
        return prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                gamesPlayed: user.gamesPlayed + 1,
                totalScore: user.totalScore + score,
                experiance: (user.experiance || 0) + experiance,
            },
        });
    }
};
