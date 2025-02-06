import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/database";
import { anonymous } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    user: {
        additionalFields: {
            gamesPlayed: {
                type: "number",
                defaultValue: 0,
            },
            totalScore: {
                type: "number",
                defaultValue: 0,
            },
            level: {
                type: "number",
                defaultValue: 1,
            },
            experiance: {
                type: "number",
                defaultValue: 0,
            },
            color: {
                type: "string",
                defaultValue: "blue",
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        anonymous({
            onLinkAccount: async ({ anonymousUser, newUser }) => {
                console.log(
                    "Linking anonymous user to new user",
                    newUser.user.name,
                    anonymousUser.user.email
                );

                const newAccount = newUser.user as User;
                const oldAccount = anonymousUser.user as User;

                if (oldAccount && newAccount) {
                    const updatedUser = await prisma.user.update({
                        where: { id: newAccount.id },
                        data: {
                            totalScore: (newAccount.totalScore || 0) + (oldAccount.totalScore || 0),
                            gamesPlayed:
                                (newAccount.gamesPlayed || 0) + (oldAccount.gamesPlayed || 0),
                            color: oldAccount.color || newAccount.color,
                            isAnonymous: false,
                        },
                    });

                    console.log("Updated new user:", updatedUser);
                }
            },
        }),
    ],
});

type Session = typeof auth.$Infer.Session;
type User = typeof auth.$Infer.Session.user;
export type { Session, User };
