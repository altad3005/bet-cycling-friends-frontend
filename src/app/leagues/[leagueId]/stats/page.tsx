"use client";

import React from 'react';
import { use, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useLeague } from '@/contexts/LeagueContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function LeagueStatsPage() {
    const { league, isLoading } = useLeague();

    if (isLoading) {
        return <LoadingSpinner size="section" />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-20">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-yellow-400" />
                </div>
                Statistiques - {league?.name}
            </h2>

            <EmptyState
                icon={BarChart3}
                title="Statistiques en construction"
                subtitle="Bientôt, retrouvez ici les graphiques d'évolution, le détail des points par course et vos statistiques personnalisées !"
                className="bg-slate-900/50 rounded-2xl border border-slate-800 py-20"
            />
        </div>
    );
}
