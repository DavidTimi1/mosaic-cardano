"use client";

import { useGetAuthState, useLogout } from "@/services/auth";
import { createContext, useContext } from "react";
import { toast } from "sonner";


const AuthContext = createContext<{
    userId: string | null;
    isLoaded: boolean;
    logout: () => Promise<void>;
    refetchAuthState: () => void;
}>({
    userId: null,
    isLoaded: false,
    logout: () => Promise.resolve(),
    refetchAuthState: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: authState, refetch, isLoaded } = useGetAuthState();
    const userId = authState?.user?.id || null;
    const logoutMutation = useLogout();

    const logout = async (isForced = false) => {
        await logoutMutation.mutateAsync();

        if (isForced) {
            toast.info("Your session has expired, please log back in to continue");
        } else {
            toast.success("You have been logged out successfully");
        }
    };

    return (
        <AuthContext.Provider value={{ userId, isLoaded, logout, refetchAuthState: refetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}