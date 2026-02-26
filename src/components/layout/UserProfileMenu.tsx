"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function UserProfileMenu() {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileMenuRef]);

    const { user, logout } = useAuth();

    // Fallback if not logged in (though GlobalHeader should prevent this from rendering)
    if (!user) return null;

    // Use a placeholder avatar or derived from the DB if available
    const displayUser = {
        name: user.pseudo,
        avatar: '🚴',
    };

    return (
        <div className="relative" ref={profileMenuRef}>
            <div
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center font-bold text-slate-900">
                    {displayUser.avatar}
                </div>
                <span className="text-white font-semibold hidden md:block">{displayUser.name}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </div>
            {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                        <User className="w-4 h-4" />
                        Profil
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </div>
            )}
        </div>
    );
}
