"use client";

import React from 'react';
import Image from 'next/image';
import UserProfileMenu from './UserProfileMenu';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function GlobalHeader() {
    const { user, isLoading } = useAuth();
    return (
        <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/leagues" className="flex items-center gap-3">
                        <Image
                            src="/bcf_logo.svg"
                            alt="Logo BetCyclingFriends"
                            width={40}
                            height={40}
                        />
                    </Link>

                    {/* User Menu or Login Button */}
                    {isLoading ? (
                        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : user ? (
                        <UserProfileMenu />
                    ) : (
                        <Link href="/login">
                            <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 hover:border-yellow-500/50 font-semibold shadow-md">
                                Connexion
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
