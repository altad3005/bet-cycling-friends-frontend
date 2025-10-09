import React from 'react';
import { Home, Calendar, BarChart3, Info, Users, Trophy, Clock, Zap, TrendingUp, Medal, Flame, ChevronRight } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

export default function LeagueHomePage() {
    // Données mock
    const leagueName = "Les Grimpeurs Fous";
    const nextRace = {
        name: "Paris-Roubaix",
        date: "Dimanche 13 avril 2025",
        timeLeft: "2h 15min",
        status: "Pariez maintenant !"
    };

    const topThree = [
        { rank: 1, name: 'MaxPower', points: 1245, avatar: '🚴', trend: '+25' },
        { rank: 2, name: 'CyclingQueen', points: 1189, avatar: '👑', trend: '+18' },
        { rank: 3, name: 'VeloMaster', points: 1156, avatar: '⚡', trend: '+12' }
    ];

    const recentActivity = [
        { user: 'MaxPower', action: 'a parié sur Wout van Aert', race: 'Paris-Roubaix', time: '5 min', bonus: 'Coup de bordure' },
        { user: 'CyclingQueen', action: 'a parié sur Mathieu van der Poel', race: 'Paris-Roubaix', time: '12 min', bonus: null },
        { user: 'SprintGod', action: 'a utilisé un Pneu crevé', race: 'Paris-Roubaix', time: '18 min', bonus: 'Pneu crevé' },
        { user: 'VeloMaster', action: 'a parié sur Filippo Ganna', race: 'Paris-Roubaix', time: '23 min', bonus: null },
    ];

    const stats = {
        totalBets: 12,
        bonusUsed: 3,
        streak: 2,
        lastUpdate: '15:42'
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
            {/* Header avec navigation */}
            <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo svg.svg"
                                alt="Logo BetCyclingFriends"
                                width={40}
                                height={40}
                            />

                            <div>
                                <h1 className="text-lg font-bold">{leagueName}</h1>
                                <p className="text-xs text-slate-400">15 membres</p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                            <Users className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 border border-yellow-500/30">
                            <Home className="w-4 h-4" />
                            Home
                        </button>
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <Link href={"/league/courses"}>Courses</Link>
                        </button>
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Stats
                        </button>
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Infos ligue
                        </button>
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Admin
                        </button>
                    </nav>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Prochaine course - CTA */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border border-yellow-500/30 p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>

                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-red-400">EN DIRECT</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            Plus que {nextRace.timeLeft}
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        {nextRace.name}
                    </h2>
                    <p className="text-slate-300 mb-4">{nextRace.date}</p>

                    <Link href="/league/bet" className="w-full block">
                        <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900 flex items-center justify-center gap-2">
                            {nextRace.status}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </Link>
                </section>

                {/* Top 3 de la ligue */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            Top 3 de la ligue
                        </h3>
                        <button className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
                            Voir tout
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {topThree.map((player, idx) => {
                            const colors = [
                                'from-yellow-400 to-yellow-600',
                                'from-gray-300 to-gray-500',
                                'from-orange-400 to-orange-600'
                            ];
                            const medals = ['🥇', '🥈', '🥉'];

                            return (
                                <div
                                    key={player.rank}
                                    className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${colors[idx]} p-[2px] hover:scale-102 transition-all duration-300`}
                                >
                                    <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="text-3xl font-bold w-10 text-center">
                                                {medals[idx]}
                                            </div>
                                            <div className="text-3xl">{player.avatar}</div>
                                            <div className="flex-1">
                                                <div className="font-bold text-lg">{player.name}</div>
                                                <div className="flex items-center gap-2 text-sm text-green-400">
                                                    <TrendingUp className="w-3 h-3" />
                                                    {player.trend} pts cette semaine
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-yellow-400">{player.points}</div>
                                            <div className="text-xs text-slate-500">points</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Fil d'actualité de la ligue */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            Fil d'actualité
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
                                        {activity.bonus && (
                                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                                                {activity.bonus}
                      </span>
                                        )}
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
                        Voir plus d'activités
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </section>

                {/* Stats rapides */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                            <Calendar className="w-4 h-4" />
                            Paris actifs
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">{stats.totalBets}</div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                            <Zap className="w-4 h-4" />
                            Bonus utilisés
                        </div>
                        <div className="text-3xl font-bold text-orange-400">{stats.bonusUsed}</div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                            <Flame className="w-4 h-4" />
                            Série en cours
                        </div>
                        <div className="text-3xl font-bold text-red-400">{stats.streak}</div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                            <Users className="w-4 h-4" />
                            Membres
                        </div>
                        <div className="text-3xl font-bold text-blue-400">15</div>
                    </div>
                </section>
            </div>
        </div>
    );
}