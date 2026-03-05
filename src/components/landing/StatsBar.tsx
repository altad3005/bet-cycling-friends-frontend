"use client";

import React, { useEffect, useState } from 'react';
import { Users, Trophy, Zap, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { leaderboardService } from '@/services/leaderboard.service';

export function StatsBar() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        leaderboardService.getGlobalStats()
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <section className="py-6 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-y border-yellow-500/20 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
            </section>
        );
    }

    return (
        <section className="py-6 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-y border-yellow-500/20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-8 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                            <Users className="w-6 h-6 text-yellow-400" />
                            {stats?.activePlayers || 0}
                        </div>
                        <div className="text-sm text-slate-400">Joueurs inscrits</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            {stats?.activeLeagues || 0}
                        </div>
                        <div className="text-sm text-slate-400">Ligues créées</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                            {stats?.totalBets || 0}
                        </div>
                        <div className="text-sm text-slate-400">Paris enregistrés</div>
                    </div>
                    {stats?.nextRace && (
                        <div>
                            <div className={`flex items-center justify-center gap-2 text-2xl font-bold mb-1 ${stats.nextRace.status === 'live' ? 'text-red-500' : 'text-blue-400'}`}>
                                {stats.nextRace.status === 'live' ? (
                                    <Zap className="w-6 h-6 animate-pulse" />
                                ) : (
                                    <Clock className="w-6 h-6" />
                                )}
                                {stats.nextRace.status === 'live' ? 'LIVE' : 'À VENIR'}
                            </div>
                            <div className="text-sm text-slate-400">
                                {stats.nextRace.name} {stats.nextRace.status === 'upcoming' && `dans ${stats.nextRace.timeLeft}`}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}