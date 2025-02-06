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

export const prismaUpdateUser = (updatedUser: User) => {
    return prisma.user.update({
        where: {
            id: updatedUser.id,
        },
        data: {
            email: updatedUser.email,
            emailVerified: updatedUser.emailVerified,
            name: updatedUser.name,
            image: updatedUser.image,
            gamesPlayed: updatedUser.gamesPlayed,
            totalScore: updatedUser.totalScore,
            level: updatedUser.level,
            experiance: updatedUser.experiance,
            color: updatedUser.color,
        },
    });
};
