"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

type User = {
    id: number;
    email: string;
    pseudo: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data.data);
                } catch (error) {
                    // Token is invalid or expired
                    localStorage.removeItem('auth_token');
                    document.cookie = 'auth_token=; path=/; max-age=0';
                    setUser(null);
                    if (window.location.pathname !== '/') {
                        window.location.href = '/';
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('auth_token', token)
        // Also write to cookie so Next.js Edge Middleware can read it for route protection
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        window.location.href = '/leagues'
    }

    const logout = () => {
        localStorage.removeItem('auth_token')
        // Clear cookie too
        document.cookie = 'auth_token=; path=/; max-age=0'
        setUser(null)
        router.push('/')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
