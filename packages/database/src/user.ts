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
};

export const mergeAccounts = (newAccount: User, oldAccount: User) => {
    console.log("Merging accounts", newAccount, oldAccount);
    console.log(newAccount);
    console.log(oldAccount);

    prisma.user.update({
        where: {
            id: newAccount.id,
        },
        data: {
            totalScore: newAccount.totalScore,
            gamesPlayed: newAccount.gamesPlayed,
        },
    });
};
