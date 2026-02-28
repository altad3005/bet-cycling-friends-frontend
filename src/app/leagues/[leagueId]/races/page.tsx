"use client";

import React, { useState, useEffect, use } from 'react';
import {
    Calendar, Trophy, Clock, MapPin, ChevronRight,
    Search, CheckCircle, Circle, Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { raceService, type Race as ApiRace, type RaceType } from '@/services/race.service';

// -------------- Helpers / Types --------------

const RACE_TYPE_LABELS: Record<RaceType, string> = {
    GRAND_TOUR: 'Grand Tour',
    MONUMENT: 'Monument',
    STAGE_RACE: 'Course par étapes',
    CLASSIC: 'Classique',
    CHAMPIONSHIP: 'Championnat',
};

type DisplayRace = {
    id: number;
    name: string;
    type: RaceType;
    category: string;
    startDate: string;
    endDate: string;
    nationality: string;
    multiplicator: number;
    status: 'upcoming' | 'live' | 'finished';
};

function getRaceStatus(startDate: string, endDate: string): DisplayRace['status'] {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return 'upcoming';
    if (now > end) return 'finished';
    return 'live';
}

function toDisplayRace(r: ApiRace): DisplayRace {
    return {
        id: r.id,
        name: r.name,
        type: r.type,
        category: RACE_TYPE_LABELS[r.type] ?? r.type,
        startDate: r.startDate,
        endDate: r.endDate,
        nationality: r.nationality,
        multiplicator: r.multiplicator,
        status: getRaceStatus(r.startDate, r.endDate),
    };
}

// -------------- Sub-components --------------

function StatusBadge({ status }: { status: DisplayRace['status'] }) {
    const badges = {
        live: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Circle, label: 'EN DIRECT', pulse: true },
        upcoming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock, label: 'À venir', pulse: false },
        finished: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle, label: 'Terminée', pulse: false },
    };
    const badge = badges[status] ?? badges.finished;
    const Icon = badge.icon;
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
            <Icon className={`w-3 h-3 ${badge.pulse ? 'animate-pulse' : ''}`} />
            {badge.label}
        </span>
    );
}

function BetButton({ race, leagueId }: { race: DisplayRace; leagueId: string }) {
    const betLink = race.type === 'GRAND_TOUR'
        ? `/leagues/${leagueId}/races/${race.id}/bet-grand-tour`
        : `/leagues/${leagueId}/races/${race.id}/bet`;

    if (race.status === 'finished') {
        return <span className="px-3 py-1.5 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium border border-slate-600">Paris fermés</span>;
    }
    if (race.status === 'live') {
        return <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium border border-orange-500/30">Course en cours</span>;
    }
    return (
        <Link href={betLink} className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-lg text-sm font-semibold transition-all text-slate-900 flex items-center gap-1.5 transform hover:scale-105">
            Parier
            <ChevronRight className="w-4 h-4" />
        </Link>
    );
}

// -------------- Main Page --------------

export default function RacesCalendarPage({ params }: { params: Promise<{ leagueId: string }> }) {
    const { leagueId } = use(params);

    const [races, setRaces] = useState<DisplayRace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        raceService.getRaces(currentYear)
            .then((res) => {
                setRaces((res.data || []).map(toDisplayRace));
            })
            .catch(() => {
                setError('Impossible de charger les courses. Veuillez réessayer.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const filters = [
        { id: 'all', label: 'Toutes' },
        { id: 'upcoming', label: 'À venir' },
        { id: 'live', label: 'En direct' },
        { id: 'finished', label: 'Terminées' },
        { id: 'MONUMENT', label: 'Monuments' },
        { id: 'GRAND_TOUR', label: 'Grands Tours' },
    ];

    const filteredRaces = races.filter(race => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'upcoming') return race.status === 'upcoming';
        if (selectedFilter === 'live') return race.status === 'live';
        if (selectedFilter === 'finished') return race.status === 'finished';
        return race.type === selectedFilter;
    }).filter(race => {
        if (!searchQuery) return true;
        return race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            race.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-20">
            <div>
                <h2 className="text-3xl font-bold mb-1">Calendrier des courses</h2>
                <p className="text-slate-400 text-sm">{new Date().getFullYear()} · {races.length} courses</p>
            </div>

            {/* Search + Filters */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une course ou un pays..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedFilter === filter.id
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="space-y-4">
                    {filteredRaces.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">Aucune course trouvée</p>
                        </div>
                    ) : (
                        filteredRaces.map((race) => (
                            <div key={race.id} className="bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-yellow-500/30 transition-all p-5">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    <Link href={`/leagues/${leagueId}/races/${race.id}`} className="flex-1 space-y-3 block group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">{race.name}</h3>
                                                    <StatusBadge status={race.status} />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(race.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                                        {race.startDate !== race.endDate && (
                                                            <> → {new Date(race.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</>
                                                        )}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4" />
                                                        {race.nationality}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm">
                                            <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">{race.category}</span>
                                            <span className="px-2 py-1 text-xs text-yellow-500 bg-yellow-500/10 rounded border border-yellow-500/20">
                                                ×{race.multiplicator}
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="flex flex-col items-end gap-2 lg:min-w-[160px] z-10">
                                        <BetButton race={race} leagueId={leagueId} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}