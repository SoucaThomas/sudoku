import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";

export function useAuth() {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const session = authClient.useSession();

    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const session = await authClient.getSession();
            if (session?.data?.user) {
                setUser(session.data.user);
            } else {
                console.log("no session, signing in anonymously"); //* debug
                const anonymousUser = await authClient.signIn.anonymous();
                setUser(anonymousUser);
            }

            setLoading(false);
        };

        checkSession();
    }, []);

    const signUp = async (email: string, password: string, name: string) => {
        await authClient.signUp.email({ email, password, name });
        if (session?.data?.user) {
            setUser(session.data.user);
        }

        router.push("/");
    };

    const signIn = async (email: string, password: string) => {
        await authClient.signIn.email({ email, password });
        if (session?.data?.user) {
            console.log("AOJSNDOJANS");
            setUser(session.data.user);
        }
    };

    const singOut = async () => {
        await authClient.signOut();
        setUser(null);
    };

    return {
        user,
        loading,
        signUp,
        signIn,
        singOut,
        session,
    };
}
