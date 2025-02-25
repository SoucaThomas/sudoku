"use server";
import { prisma } from "@repo/database";

export const checkRoom = async (roomId: string) => {
    return prisma?.room.findUnique({
        where: {
            roomId,
        },
    });
};

export const getLeaderboard = async () => {
    return prisma?.user.findMany({
        orderBy: {
            totalScore: "desc",
        },
    });
};
