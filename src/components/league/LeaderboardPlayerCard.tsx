import React from 'react';
import { Medal } from 'lucide-react';
import { getMedalStyles } from '@/lib/constants';

type LeaderboardPlayerCardProps = {
    player: {
        id: number | string;
        pseudo: string;
        icone?: string | null;
        total_score: number;
    };
    rank: number;
    compact?: boolean;
};

export default function LeaderboardPlayerCard({ player, rank, compact = false }: LeaderboardPlayerCardProps) {
    const style = getMedalStyles(rank);

    if (compact) {
        return (
            <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${style.bg} p-[2px] transition-all duration-300`}>
                <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl font-bold w-10 text-center">
                            {style.icon}
                        </div>
                        <div className="text-3xl">
                            {player.icone && player.icone.startsWith('http') ? (
                                <img src={player.icone} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                player.icone || '🚴'
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-lg">{player.pseudo}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">{player.total_score}</div>
                        <div className="text-xs text-slate-500">points</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${style.bg} p-[2px] transition-all duration-300 hover:scale-[1.01] shadow-lg`}>
            {rank === 0 && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 blur-3xl rounded-full"></div>
            )}
            <div className={`rounded-[14px] p-6 flex items-center gap-6 ${rank < 3 ? 'bg-slate-900/95' : 'bg-slate-900'}`}>
                {/* Rank Logo */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 ${rank < 3 ? 'bg-gradient-to-br text-slate-900' : 'bg-slate-800 text-slate-300'} ${rank < 3 ? style.bg : ''}`}>
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
                        {rank === 0 && <div className="text-xs font-semibold text-yellow-500 uppercase flex items-center gap-1"><Medal className="w-3 h-3" /> Leader Actuel</div>}
                    </div>
                </div>

                {/* Points */}
                <div className="text-right">
                    <div className={`text-3xl font-black tracking-tight ${rank < 3 ? 'text-transparent bg-clip-text bg-gradient-to-r ' + style.bg : 'text-slate-200'}`}>
                        {player.total_score}
                    </div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">
                        Points
                    </div>
                </div>
            </div>
        </div>
    );
}
