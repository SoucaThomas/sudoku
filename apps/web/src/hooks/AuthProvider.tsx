"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";
import { User, Session } from "../../auth";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isLoggedIn: boolean;
    updateUser: (user: User) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const session = await authClient.getSession();
            if (session?.data?.user) {
                setUser(session.data.user);
                setSession(session.data);

                setLoading(false);
                setIsLoggedIn(true);
            } else {
                const anonymousUser = await authClient.signIn.anonymous();
                if (anonymousUser.data?.user) {
                    setUser({
                        ...anonymousUser.data.user,
                        gamesPlayed: 0,
                        totalScore: 0,
                        level: 0,
                        experiance: 0,
                        color: "blue",
                    });
                    setSession(session.data);

                    setIsLoggedIn(false);
                }
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const signUp = async (email: string, password: string, name: string) => {
        await authClient.signUp.email({ email, password, name });
        const session = await authClient.getSession();
        if (session?.data?.user) {
            setUser(session.data.user);

            setIsLoggedIn(true);
        }
    };

    const signIn = async (email: string, password: string) => {
        await authClient.signIn.email({ email, password });
        const session = await authClient.getSession();
        if (session?.data?.user) {
            setUser(session.data.user);

            setIsLoggedIn(true);
        }
    };

    const signOut = async () => {
        if (!user) return;

        setLoading(true);
        await authClient.signOut();

        const session = await authClient.getSession();
        const anonymousUser = await authClient.signIn.anonymous();
        if (anonymousUser.data?.user) {
            setUser({
                ...anonymousUser.data.user,
                gamesPlayed: 0,
                totalScore: 0,
                level: 0,
                experiance: 0,
                color: "blue",
            });
            setSession(session.data);
        }

        setLoading(false);
        setIsLoggedIn(false);
    };

    const updateUser = async (user: User) => {
        const { email, ...updatedUser } = user;

        setUser(user);
        await authClient.updateUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{ user, updateUser, loading, signUp, signIn, signOut, session, isLoggedIn }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useCurrentUser() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useCurrentUser must be used within an AuthProvider");
    }
    return context.user;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
