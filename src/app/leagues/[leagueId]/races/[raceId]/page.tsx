"use client";

import React, { use } from 'react';
import { Calendar, MapPin, Trophy, ChevronRight, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const raceData = {
    finished: {
        id: 3,
        name: "Milan-San Remo",
        date: "22 mars 2025",
        type: "one-day",
        category: "Monument",
        country: "Italie",
        status: "finished",
        winner: "Jasper Philipsen",
        leagueRanking: [
            { rank: 1, name: 'MaxPower', points: 120, avatar: '🚴' },
            { rank: 2, name: 'VeloMaster', points: 100, avatar: '⚡' },
            { rank: 3, name: 'CyclingQueen', points: 85, avatar: '👑' },
            { rank: 4, name: 'SprintGod', points: 75, avatar: '🚀' },
            { rank: 5, name: 'ClimberKing', points: 65, avatar: '🏔️' },
        ]
    },
    upcoming: {
        id: 4,
        name: "Tour de France",
        date: "Du 5 au 27 juillet 2025",
        type: "grand-tour",
        category: "Grand Tour",
        country: "France",
        status: "upcoming",
        betStatus: "open",
    }
};

const RaceDetailPage = ({ params }: { params: Promise<{ raceId: string }> }) => {
    // 1. Déballage des paramètres (Next.js 15)
    const resolvedParams = use(params);
    const raceId = resolvedParams.raceId;

    // Simulation de récupération des données (A remplacer par ton fetch API)
    const race = raceId === '3' ? raceData.finished : raceData.upcoming;

    // 2. Création du lien dynamique
    const betLink = race.type === 'grand-tour'
        ? `/league/races/${raceId}/bet-grand-tour`
        : `/league/races/${raceId}/bet`;

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-20">
            {/* Race Header */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/20 via-sky-500/20 to-cyan-500/20 border border-blue-500/30 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            {race.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mt-3">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{race.date}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{race.country}</span>
                            <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">{race.category}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {race.status === 'upcoming' && (
                    /* CORRECTION : Pas de <button> dans le <Link>, on applique le style au Link */
                    <Link
                        href={betLink}
                        className="w-full p-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
                    >
                        <Trophy className="w-5 h-5" />
                        Parier sur la course
                    </Link>
                )}

                {/* CORRECTION : Pas de <button> dans le <Link> */ }
                <Link
                    href={`/src/app/leagues/%5BleagueId%5D/races/${raceId}/startlist`}
                    className="w-full p-4 bg-slate-800 text-slate-300 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                >
                    <Users className="w-5 h-5" />
                    Voir la Startlist
                </Link>
            </section>

            {/* Race Results (if finished) */}
            {race.status === 'finished' && 'leagueRanking' in race && race.leagueRanking && (
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-yellow-400" />
                            Classement de la ligue
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {race.leagueRanking.slice(0, 3).map((player, idx) => {
                            const colors = ['from-yellow-400 to-yellow-600', 'from-gray-300 to-gray-500', 'from-orange-400 to-orange-600'];
                            const medals = ['🥇', '🥈', '🥉'];
                            return (
                                <div key={player.rank} className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${colors[idx]} p-px`}>
                                    <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl font-bold w-8 text-center">{medals[idx]}</div>
                                            <div className="text-2xl">{player.avatar}</div>
                                            <div className="font-bold text-lg">{player.name}</div>
                                        </div>
                                        <div className="text-xl font-bold text-yellow-400">{player.points} pts</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Ce bouton ne mène nulle part pour l'instant, on le laisse en button simple */}
                    <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        Voir le classement complet
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </section>
            )}
        </div>
    );
};

export default RaceDetailPage;