import React from 'react';
import { Trophy } from 'lucide-react';
import LeaderboardPlayerCard from '@/components/league/LeaderboardPlayerCard';

export function Leaderboard() {
    // Mock data
    const topPlayers = [
        { id: 1, pseudo: 'MaxPower', total_score: 1245, icone: '🚴' },
        { id: 2, pseudo: 'CyclingQueen', total_score: 1189, icone: '👑' },
        { id: 3, pseudo: 'VeloMaster', total_score: 1156, icone: '⚡' },
        { id: 4, pseudo: 'SprinterPro', total_score: 1098, icone: '🏆' },
        { id: 5, pseudo: 'ClimberKing', total_score: 1045, icone: '⛰️' },
        { id: 6, pseudo: 'RouleVite', total_score: 998, icone: '💨' },
        { id: 7, pseudo: 'PedalPower', total_score: 967, icone: '🔥' },
        { id: 8, pseudo: 'BikeNinja', total_score: 934, icone: '🥷' },
        { id: 9, pseudo: 'TourFan', total_score: 901, icone: '🎯' },
        { id: 10, pseudo: 'SprintGod', total_score: 876, icone: '⚡' }
    ];



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
                    {topPlayers.map((player, idx) => (
                        <LeaderboardPlayerCard key={player.id} player={player as any} rank={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}