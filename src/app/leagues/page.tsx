"use client";

import React from 'react';
import { Plus, Users, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import GlobalHeader from '@/components/layout/GlobalHeader';

// Mock data for user's leagues
const userLeagues = [
    {
        id: '1',
        name: "Les Grimpeurs Fous",
        members: 15,
        nextRace: "Tour de France",
        userPosition: 3,
        isFavorite: true,
    },
    {
        id: '2',
        name: "Pro-Peloton",
        members: 8,
        nextRace: "La Vuelta",
        userPosition: 1,
        isFavorite: false,
    },
    {
        id: '3',
        name: "Les Flahutes du Dimanche",
        members: 22,
        nextRace: "Paris-Roubaix",
        userPosition: 18,
        isFavorite: false,
    },
];

export default function LeaguesPage() {
    return (
        <>
            <GlobalHeader />
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            Mes Ligues
                        </h1>
                        <p className="text-slate-400 mt-2">Rejoins une ligue ou crées-en une pour commencer à parier !</p>
                    </div>
                    <Link href="/leagues/create">
                        <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105">
                            <Plus className="w-5 h-5" />
                            Créer une ligue
                        </button>
                    </Link>
                </div>

                {/* Join League Section */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <h2 className="text-2xl font-bold mb-4">Rejoindre une ligue</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Entre le code de la ligue..."
                            className="flex-grow px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors">
                            Rejoindre
                        </button>
                    </div>
                </section>

                {/* League List */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Tes ligues actuelles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userLeagues.map(league => (
                            <Link key={league.id} href={`/leagues/${league.id}`} className="block group">
                                <div className="h-full bg-slate-900/50 rounded-2xl border border-slate-800 group-hover:border-yellow-500/50 transition-all p-6 flex flex-col justify-between">
                                    <div>
                                        {league.isFavorite && (
                                            <div className="text-xs text-yellow-400 flex items-center gap-1 mb-2">
                                                <Star className="w-4 h-4" /> Favori
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">{league.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                                            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {league.members} membres</span>
                                            <span>•</span>
                                            <span>Position: {league.userPosition}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
                                        <div className="text-sm text-slate-400">
                                            Prochaine course: <span className="font-semibold text-slate-300">{league.nextRace}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
