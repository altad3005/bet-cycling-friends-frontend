"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function LandingActions() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-14 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (user) {
        return (
            <Link href="/leagues">
                <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900 w-full sm:w-auto">
                    Voir mes ligues
                </button>
            </Link>
        );
    }

    return (
        <Link href="/register">
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900 w-full sm:w-auto">
                Créer ma ligue gratuite
            </button>
        </Link>
    );
}
