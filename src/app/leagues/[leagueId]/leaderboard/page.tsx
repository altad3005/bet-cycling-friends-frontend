"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Award } from 'lucide-react';
import { useLeague } from '@/contexts/LeagueContext';
import { leaderboardService, type LeaderboardEntry } from '@/services/leaderboard.service';
import { useParams } from 'next/navigation';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BackLink from '@/components/ui/BackLink';
import EmptyState from '@/components/ui/EmptyState';
import LeaderboardPlayerCard from '@/components/league/LeaderboardPlayerCard';

export default function LeagueLeaderboardPage() {
    const { league, isLoading: isLeagueLoading } = useLeague();
    const params = useParams();
    const leagueId = params.leagueId as string;

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (leagueId) {
            leaderboardService.getLeagueLeaderboard(leagueId)
                .then(res => setLeaderboard(res.data || []))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [leagueId]);

    if (isLeagueLoading || isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <BackLink href={`/leagues/${leagueId}`} label="" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700" />
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        Classement de la Ligue
                    </h1>
                    <p className="text-slate-400 mt-1">{league?.name}</p>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-4">
                {leaderboard.length === 0 ? (
                    <EmptyState
                        icon={Award}
                        title="Classement vide"
                        subtitle="Aucun point n'a encore été marqué dans cette ligue."
                        className="bg-slate-900/50 rounded-2xl p-12 border border-slate-800"
                    />
                ) : (
                    leaderboard.map((player, idx) => (
                        <LeaderboardPlayerCard key={player.id} player={player as any} rank={idx} />
                    ))
                )}
            </div>
        </div>
    );
}
