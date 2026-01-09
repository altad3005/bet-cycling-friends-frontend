import React from 'react';
import { Trophy } from 'lucide-react';

export function Leaderboard() {
    // Mock data
    const topPlayers = [
        { rank: 1, name: 'MaxPower', points: 1245, avatar: '🚴' },
        { rank: 2, name: 'CyclingQueen', points: 1189, avatar: '👑' },
        { rank: 3, name: 'VeloMaster', points: 1156, avatar: '⚡' },
        { rank: 4, name: 'SprinterPro', points: 1098, avatar: '🏆' },
        { rank: 5, name: 'ClimberKing', points: 1045, avatar: '⛰️' },
        { rank: 6, name: 'RouleVite', points: 998, avatar: '💨' },
        { rank: 7, name: 'PedalPower', points: 967, avatar: '🔥' },
        { rank: 8, name: 'BikeNinja', points: 934, avatar: '🥷' },
        { rank: 9, name: 'TourFan', points: 901, avatar: '🎯' },
        { rank: 10, name: 'SprintGod', points: 876, avatar: '⚡' }
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
                    {topPlayers.map((player) => (
                        <div
                            key={player.rank}
                            className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${getRankColor(player.rank)} p-[2px] hover:scale-102 transition-all duration-300`}
                        >
                            <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="text-3xl font-bold w-12 text-center">
                                        {getRankIcon(player.rank)}
                                    </div>
                                    <div className="text-4xl">{player.avatar}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{player.name}</div>
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
            </div>
        </section>
    );
}