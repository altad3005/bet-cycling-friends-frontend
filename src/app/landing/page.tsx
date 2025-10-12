"use client";

import React, {useState} from 'react';
import {Trophy, Users, Zap, CheckCircle, TrendingUp, Flame} from 'lucide-react';
import Image from "next/image";

export default function LandingPage() {
    const [timeLeft] = useState('2h 15min');

    // Mock data pour le top 10
    const topPlayers = [
        { rank: 1, name: 'MaxPower', points: 1245, streak: 5, avatar: '🚴' },
        { rank: 2, name: 'CyclingQueen', points: 1189, streak: 3, avatar: '👑' },
        { rank: 3, name: 'VeloMaster', points: 1156, streak: 4, avatar: '⚡' },
        { rank: 4, name: 'SprinterPro', points: 1098, streak: 2, avatar: '🏆' },
        { rank: 5, name: 'ClimberKing', points: 1045, streak: 0, avatar: '⛰️' },
        { rank: 6, name: 'RouleVite', points: 998, streak: 1, avatar: '💨' },
        { rank: 7, name: 'PedalPower', points: 967, streak: 0, avatar: '🔥' },
        { rank: 8, name: 'BikeNinja', points: 934, streak: 2, avatar: '🥷' },
        { rank: 9, name: 'TourFan', points: 901, streak: 0, avatar: '🎯' },
        { rank: 10, name: 'SprintGod', points: 876, streak: 1, avatar: '⚡' }
    ];

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'from-yellow-400 to-yellow-600';
        if (rank === 2) return 'from-gray-300 to-gray-500';
        if (rank === 3) return 'from-orange-400 to-orange-600';
        return 'from-slate-700 to-slate-900';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Header */}
            <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg z-50 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo svg.svg"
                            alt="Logo BetCyclingFriends"
                            width={100}
                            height={40}
                        />

                    </div>
                    <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 hover:border-yellow-500/50">
                        Connexion
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Image
                        src="/BCF Logo Complet.svg"
                        alt="Logo BetCyclingFriends"
                        width={600}
                        height={40}
                        className="mx-auto mb-6"
                    />
                    
                    

                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        Crée ta ligue privée, pronostique les courses du World Tour et grimpe au classement avec tes amis
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900">
                            Créer ma ligue gratuite
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Gratuit
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Données sécurisées
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            +1000 joueurs
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Stats Bar */}
            <section className="py-6 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border-y border-yellow-500/20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                                <Users className="w-6 h-6 text-yellow-400" />
                                1,234
                            </div>
                            <div className="text-sm text-slate-400">Joueurs actifs</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                                45
                            </div>
                            <div className="text-sm text-slate-400">Ligues en cours</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1 text-red-500">
                                <Zap className="w-6 h-6 animate-pulse" />
                                LIVE
                            </div>
                            <div className="text-sm text-slate-400">Paris-Roubaix dans {timeLeft}</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-1">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                                245
                            </div>
                            <div className="text-sm text-slate-400">Paris en cours</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top 10 */}
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
                        {topPlayers.map((player, idx) => (
                            <div
                                key={player.rank}
                                className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${getRankColor(player.rank)} p-[2px] hover:scale-102 transition-all duration-300`}
                                style={{
                                    animationDelay: `${idx * 50}ms`,
                                    animation: 'slideIn 0.5s ease-out forwards',
                                    opacity: 0
                                }}
                            >
                                <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="text-3xl font-bold w-12 text-center">
                                            {getRankIcon(player.rank)}
                                        </div>
                                        <div className="text-4xl">{player.avatar}</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-lg">{player.name}</div>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                {player.streak > 0 && (
                                                    <span className="flex items-center gap-1 text-orange-400">
                            <Flame className="w-4 h-4" />
                                                        {player.streak} en série
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-yellow-400">{player.points}</div>
                                        <div className="text-xs text-slate-500">points</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors inline-flex items-center gap-2">
                            Voir le classement complet
                            <TrendingUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 px-4 bg-slate-900/50">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-4xl font-bold text-center mb-16">Comment ça marche ?</h3>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-yellow-500/50 transition-all">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center text-4xl">
                                👥
                            </div>
                            <h4 className="text-xl font-bold mb-4">1. Crée ta ligue</h4>
                            <p className="text-slate-400">
                                Invite tes amis avec un code unique et lancez votre compétition privée
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-yellow-500/50 transition-all">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-4xl">
                                🎯
                            </div>
                            <h4 className="text-xl font-bold mb-4">2. Parie sur tes coureurs</h4>
                            <p className="text-slate-400">
                                Choisis tes favoris avant chaque course et utilise des bonus stratégiques
                            </p>
                        </div>

                        <div className="text-center p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-yellow-500/50 transition-all">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-4xl">
                                🏆
                            </div>
                            <h4 className="text-xl font-bold mb-4">3. Domine le classement</h4>
                            <p className="text-slate-400">
                                Accumule des points à chaque course et deviens le champion de ta ligue
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-3xl p-12">
                    <h3 className="text-4xl font-bold mb-4">Prêt à rejoindre le peloton ?</h3>
                    <p className="text-xl text-slate-400 mb-8">
                        Crée ta ligue en 2 minutes et commence à parier sur les courses
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900">
                        Créer ma ligue gratuitement
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8 px-4 text-center text-slate-400 text-sm">
                <p>© 2025 BetCyclingFriends • Fait avec ❤️ pour les passionnés de cyclisme</p>
            </footer>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}