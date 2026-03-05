"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import LeaderboardPlayerCard from '@/components/league/LeaderboardPlayerCard';
import { leaderboardService, type LeaderboardEntry } from '@/services/leaderboard.service';

export function Leaderboard() {
    const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        leaderboardService.getGlobalLeaderboard()
            .then(res => setTopPlayers(res.data.slice(0, 10)))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);
    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Trophy className="w-10 h-10 text-yellow-400" />
                        Top 10 du moment
                    </h3>
                    <p className="text-slate-400">Les meilleurs pronostiqueurs de la saison</p>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                        </div>
                    ) : topPlayers.length === 0 ? (
                        <p className="text-center text-slate-500">Aucun pronostiqueur n'a encore obtenu de points.</p>
                    ) : (
                        topPlayers.map((player, idx) => (
                            <LeaderboardPlayerCard key={player.id} player={player as any} rank={idx} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}