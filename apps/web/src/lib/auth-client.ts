import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "../../auth";

export const authClient = createAuthClient({
    baseURL: "https://sudoku.soucathomas.tech",
    plugins: [anonymousClient(), inferAdditionalFields<typeof auth>()],
});
