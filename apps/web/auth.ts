import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/database";
import { anonymous } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        anonymous({
            onLinkAccount: async ({ anonymousUser, newUser }) => {
                console.log("Linking account", anonymousUser, newUser);
            },
        }),
    ],
});
