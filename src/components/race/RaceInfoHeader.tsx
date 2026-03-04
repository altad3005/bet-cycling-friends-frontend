import React from 'react';
import { Calendar, MapPin, Mountain } from 'lucide-react';
import { type Race } from '@/services/race.service';
import { RACE_TYPE_LABELS } from '@/lib/constants';

type RaceInfoHeaderProps = {
    race: Race;
    /** Whether to show the number of stages (for Grand Tours) */
    showStageCount?: boolean;
    stageCount?: number;
};

export default function RaceInfoHeader({ race, showStageCount = false, stageCount = 21 }: RaceInfoHeaderProps) {
    const isGrandTour = race.type === 'GRAND_TOUR';

    return (
        <section className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 ${isGrandTour ? 'bg-purple-500/10' : 'bg-yellow-500/10'}`}></div>

            <div className="inline-block px-3 py-1 bg-slate-800 rounded-full border border-slate-700 mb-4">
                <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
                    {RACE_TYPE_LABELS[race.type] || race.type}
                </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {race.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {new Date(race.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {race.nationality}
                </span>
                {showStageCount && isGrandTour && (
                    <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                        <Mountain className="w-4 h-4 text-slate-500" />
                        {stageCount} étapes
                    </span>
                )}
            </div>
        </section>
    );
}
