"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, ChevronLeft, Loader2, Award, Medal } from 'lucide-react';
import Link from "next/link";
import { useLeague } from '@/contexts/LeagueContext';
import { leaderboardService, type LeaderboardEntry } from '@/services/leaderboard.service';
import { useParams } from 'next/navigation';

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
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    const goldMedalColor = "from-yellow-400 to-amber-600";
    const silverMedalColor = "from-slate-300 to-slate-500";
    const bronzeMedalColor = "from-orange-400 to-orange-700";

    const getMedalStyles = (rank: number) => {
        if (rank === 0) return { bg: goldMedalColor, icon: '🥇' };
        if (rank === 1) return { bg: silverMedalColor, icon: '🥈' };
        if (rank === 2) return { bg: bronzeMedalColor, icon: '🥉' };
        return { bg: "from-slate-700 to-slate-800", icon: `${rank + 1}e` };
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/leagues/${leagueId}`}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-slate-300" />
                </Link>
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
                    <div className="bg-slate-900/50 rounded-2xl p-12 border border-slate-800 text-center">
                        <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-300 mb-2">Classement vide</h3>
                        <p className="text-slate-500">Aucun point n'a encore été marqué dans cette ligue.</p>
                    </div>
                ) : (
                    leaderboard.map((player, idx) => {
                        const style = getMedalStyles(idx);

                        return (
                            <div
                                key={player.id}
                                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${style.bg} p-[2px] transition-all duration-300 hover:scale-[1.01] shadow-lg`}
                            >
                                {idx === 0 && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 blur-3xl rounded-full"></div>
                                )}
                                <div className={`rounded-[14px] p-6 flex items-center gap-6 ${idx < 3 ? 'bg-slate-900/95' : 'bg-slate-900'}`}>

                                    {/* Rank Logo */}
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${idx < 3 ? 'bg-gradient-to-br text-slate-900' : 'bg-slate-800 text-slate-300'} ${idx < 3 ? style.bg : ''}`}>
                                        {style.icon}
                                    </div>

                                    {/* Player Avatar & Name */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-14 h-14 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {player.icone && player.icone.startsWith('http') ? (
                                                <img src={player.icone} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl">{player.icone || '🚴'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                                {player.pseudo}
                                            </div>
                                            {idx === 0 && <div className="text-xs font-semibold text-yellow-500 uppercase flex items-center gap-1"><Medal className="w-3 h-3" /> Leader Actuel</div>}
                                        </div>
                                    </div>

                                    {/* Points */}
                                    <div className="text-right">
                                        <div className={`text-3xl font-black tracking-tight ${idx < 3 ? 'text-transparent bg-clip-text bg-gradient-to-r ' + style.bg : 'text-slate-200'}`}>
                                            {player.total_score}
                                        </div>
                                        <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">
                                            Points
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
