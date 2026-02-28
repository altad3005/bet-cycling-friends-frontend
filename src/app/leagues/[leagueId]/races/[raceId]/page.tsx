"use client";

import React, { useState, useEffect, use } from 'react';
import { Calendar, MapPin, Trophy, ChevronRight, Users, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { raceService, type Race } from '@/services/race.service';

const RACE_TYPE_LABELS: Record<string, string> = {
    GRAND_TOUR: 'Grand Tour',
    MONUMENT: 'Monument',
    STAGE_RACE: 'Course par étapes',
    CLASSIC: 'Classique',
    CHAMPIONSHIP: 'Championnat',
};

const RaceDetailPage = ({ params }: { params: Promise<{ leagueId: string, raceId: string }> }) => {
    const { leagueId, raceId } = use(params);

    const [race, setRace] = useState<Race | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        raceService.getRaceById(raceId)
            .then((res) => setRace(res.data))
            .catch(() => setError('Impossible de charger les détails de cette course.'))
            .finally(() => setIsLoading(false));
    }, [raceId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (error || !race) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error || "Course introuvable"}
                </div>
            </div>
        );
    }

    const betLink = race.type === 'GRAND_TOUR'
        ? `/leagues/${leagueId}/races/${raceId}/bet-grand-tour`
        : `/leagues/${leagueId}/races/${raceId}/bet`;

    const now = new Date();
    const startDate = new Date(race.startDate);
    const endDate = new Date(race.endDate);
    const status = now < startDate ? 'upcoming' : now > endDate ? 'finished' : 'live';

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
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                {startDate.getTime() !== endDate.getTime() && ` - ${endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {race.nationality}
                            </span>
                            <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                                {RACE_TYPE_LABELS[race.type] || race.type}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {status !== 'finished' && (
                    <Link
                        href={betLink}
                        className="w-full p-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105"
                    >
                        <Trophy className="w-5 h-5" />
                        Parier sur la course
                    </Link>
                )}

                <Link
                    href={`/leagues/${leagueId}/races/${raceId}/startlist`}
                    className="w-full p-4 bg-slate-800 text-slate-300 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                >
                    <Users className="w-5 h-5" />
                    Voir la Startlist
                </Link>
            </section>

            {/* Race Results (if finished) - TODO: Need league-specific ranking endpoint */}
            {status === 'finished' && (
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 text-center py-12">
                    <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Classement de la ligue</h3>
                    <p className="text-slate-500">Le calcul des points pour cette course arrive bientôt.</p>
                </section>
            )}
        </div>
    );
};

export default RaceDetailPage;