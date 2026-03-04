import React from 'react';

type PredictionRankRowProps = {
    rank: number;
    userName: string;
    isCurrentUser: boolean;
    points: number;
    detailsLeft?: React.ReactNode;
};

export default function PredictionRankRow({ rank, userName, isCurrentUser, points, detailsLeft }: PredictionRankRowProps) {
    return (
        <div className="p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${rank === 0 ? 'bg-yellow-500 text-slate-900' :
                        rank === 1 ? 'bg-slate-400 text-slate-900' :
                            rank === 2 ? 'bg-amber-700 text-slate-100' :
                                'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                    {rank + 1}
                </div>
                <div className="flex flex-col">
                    <div className="font-bold text-slate-200">
                        {userName} {isCurrentUser && <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full ml-2">Toi</span>}
                    </div>
                    {detailsLeft && <div className="mt-1.5">{detailsLeft}</div>}
                </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 md:ml-auto">
                <span className="text-2xl font-black text-white">{points || 0}</span>
                <span className="text-sm font-semibold text-slate-400">PTS</span>
            </div>
        </div>
    );
}
