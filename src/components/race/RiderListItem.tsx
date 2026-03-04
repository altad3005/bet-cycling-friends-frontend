import React from 'react';
import { Trophy, Star, CheckCircle } from 'lucide-react';
import { type Rider } from '@/services/race.service';

type RiderListItemProps = {
    rider: Rider;
    isSelected?: boolean;
    selectionType?: 'winner' | 'bonus' | 'team';
    disabled?: boolean;
    onClick?: () => void;
};

export default function RiderListItem({
    rider,
    isSelected = false,
    selectionType,
    disabled = false,
    onClick,
}: RiderListItemProps) {
    const team = rider.team || rider.$extras?.pivot_team_name;
    const isWinner = isSelected && selectionType === 'winner';
    const isBonus = isSelected && selectionType === 'bonus';
    const isTeam = isSelected && selectionType === 'team';

    let wrapperClass = 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 shadow-sm';
    let textClass = 'text-slate-100 group-hover:text-white';

    if (isWinner) {
        wrapperClass = 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]';
        textClass = 'text-yellow-400';
    } else if (isBonus) {
        wrapperClass = 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]';
        textClass = 'text-purple-400';
    } else if (isTeam) {
        wrapperClass = 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]';
        textClass = 'text-indigo-400';
    }

    const hoverEffect = disabled ? 'cursor-default opacity-50' : 'hover:-translate-y-0.5';

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`group w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${wrapperClass} ${hoverEffect}`}
        >
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 flex-shrink-0 bg-slate-950 rounded-full flex items-center justify-center overflow-hidden border border-slate-700 shadow-inner">
                    {rider.countryCode ? (
                        <img
                            src={`https://flagcdn.com/w40/${rider.countryCode.toLowerCase()}.png`}
                            alt={rider.countryCode}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-xl font-bold text-slate-600">?</span>
                    )}
                </div>
                <div>
                    <div className={`text-xl font-bold mb-1 transition-colors break-words line-clamp-2 ${textClass}`}>
                        {rider.fullName}
                    </div>
                    <div className="text-sm font-medium text-slate-400">{team}</div>
                </div>
            </div>

            <div className="flex gap-2 sm:ml-auto flex-shrink-0 mt-2 sm:mt-0">
                {isWinner && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-bold border border-yellow-500/30">
                        <Trophy className="w-4 h-4" /> Vainqueur
                    </span>
                )}
                {isBonus && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-bold border border-purple-500/30">
                        <Star className="w-4 h-4" /> Bonus
                    </span>
                )}
                {isTeam && (
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-400 flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                )}
                {!isSelected && !disabled && (
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 group-hover:border-slate-500 transition-colors flex items-center justify-center bg-slate-950">
                        {selectionType === 'team' ? (
                            <div className="w-4 h-4 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-950">
                                +
                            </div>
                        ) : (
                            <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors opacity-0 group-hover:opacity-100"></div>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
}
