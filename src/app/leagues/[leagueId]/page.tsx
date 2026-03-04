"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Zap, ChevronRight, Loader2, Calendar } from 'lucide-react';
import Link from "next/link";
import { useLeague } from '@/contexts/LeagueContext';
import { raceService, type Race } from '@/services/race.service';
import { leaderboardService, type LeaderboardEntry } from '@/services/leaderboard.service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LeaderboardPlayerCard from '@/components/league/LeaderboardPlayerCard';

export default function LeagueHomePage() {
    const { league, isLoading: isLeagueLoading } = useLeague();

    const [races, setRaces] = useState<Race[]>([]);
    const [isRacesLoading, setIsRacesLoading] = useState(true);

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        raceService.getRaces(currentYear)
            .then((res) => setRaces(res.data || []))
            .catch(console.error)
            .finally(() => setIsRacesLoading(false));
    }, []);

    useEffect(() => {
        if (league?.id) {
            setIsLeaderboardLoading(true);
            leaderboardService.getLeagueLeaderboard(league.id)
                .then(res => setLeaderboard(res.data.slice(0, 3)))
                .catch(console.error)
                .finally(() => setIsLeaderboardLoading(false));
        }
    }, [league?.id]);

    const now = new Date();
    const upcomingOrLiveRaces = races
        .filter(r => new Date(r.endDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const nextRace = upcomingOrLiveRaces.length > 0 ? upcomingOrLiveRaces[0] : null;
    const isNextRaceLive = nextRace ? new Date(nextRace.startDate) <= now && new Date(nextRace.endDate) >= now : false;

    const recentActivity = [
        { user: 'MaxPower', action: 'a parié sur Wout van Aert', race: 'Paris-Roubaix', time: '5 min' },
    ];

    const stats = { totalBets: 12, streak: 2, lastUpdate: '15:42' };

    if (isLeagueLoading || isRacesLoading || isLeaderboardLoading) {
        return <LoadingSpinner size="page" />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-20">
            {nextRace ? (
                <section className={`relative overflow-hidden rounded-2xl border p-6 ${isNextRaceLive ? 'bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border-red-500/30' : 'bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border-yellow-500/30'}`}>
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 ${isNextRaceLive ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}></div>

                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {isNextRaceLive ? (
                                <>
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-red-400">EN DIRECT</span>
                                </>
                            ) : (
                                <>
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-semibold text-blue-400">COURSE À VENIR</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span className="px-2 py-1 bg-slate-900/50 rounded-md border border-slate-700/50">
                                ×{nextRace.multiplicator}
                            </span>
                        </div>
                    </div>

                    <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${isNextRaceLive ? 'from-red-400 to-orange-500' : 'from-yellow-400 to-amber-500'}`}>
                        {nextRace.name}
                    </h2>
                    <p className="text-slate-300 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(nextRace.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <Link href={`/leagues/${league?.id}/races/${nextRace.id}`} className="w-full block">
                        <button className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-white ${isNextRaceLive ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-red-500/20' : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-900 shadow-yellow-500/20'}`}>
                            {isNextRaceLive ? 'Voir la course en direct' : 'Voir les détails & Parier'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </Link>
                </section>
            ) : (
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 text-center py-12">
                    <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Aucune course à venir</h3>
                    <p className="text-slate-500">Toutes les courses de la saison semblent être terminées.</p>
                </section>
            )}

            {/* Top 3 de la ligue */}
            <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        Top 3 de la ligue
                    </h3>
                    <Link href={`/leagues/${league?.id}/leaderboard`}>
                        <button className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
                            Voir tout
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                <div className="space-y-3">
                    {leaderboard.length === 0 ? (
                        <div className="text-center text-slate-500 py-4">Aucun point attribué pour l'instant.</div>
                    ) : (
                        leaderboard.map((player, idx) => (
                            <LeaderboardPlayerCard key={player.id} player={player as any} rank={idx} />
                        ))
                    )}
                </div>
            </section>

            {/* Fil d'actualité de la ligue */}
            <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        Fil d&apos;actualité
                    </h3>
                    <div className="text-xs text-slate-500">
                        Dernière mise à jour : {stats.lastUpdate}
                    </div>
                </div>

                <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center font-bold text-slate-900 flex-shrink-0">
                                {activity.user[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-semibold text-yellow-400">{activity.user}</span>
                                    <span className="text-slate-300">{activity.action}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <span>{activity.race}</span>
                                    <span>•</span>
                                    <span>il y a {activity.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    Voir plus d&apos;activités
                    <ChevronRight className="w-4 h-4" />
                </button>
            </section>
        </div>
    );
}