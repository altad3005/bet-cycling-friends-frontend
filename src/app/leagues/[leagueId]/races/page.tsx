"use client";

import React, { useState, use } from 'react';
import { Calendar, Trophy, Clock, MapPin, ChevronRight, Search, CheckCircle, Circle } from 'lucide-react';
import Link from 'next/link';

type Race = {
    id: number;
    name: string;
    date: string;
    type: 'one-day' | 'grand-tour' | 'stage-race';
    category: string;
    country: string;
    status: 'upcoming' | 'live' | 'finished';
    timeLeft?: string;
    distance?: string;
    betStatus: 'pending' | 'open' | 'closed' | 'soon' | 'live';
    hasBet: boolean;
    winner?: string;
    currentLeader?: string;
};

export default function RacesCalendarPage({ params }: { params: Promise<{ leagueId: string }> }) {
    const resolvedParams = use(params);
    const leagueId = resolvedParams.leagueId;

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const races: Race[] = [
        {
            id: 1,
            name: "Paris-Roubaix",
            date: "2025-04-13",
            type: "one-day",
            category: "Monument",
            country: "France",
            status: "upcoming",
            timeLeft: "2h 15min",
            distance: "257 km",
            betStatus: "pending",
            hasBet: false
        },
        {
            id: 4,
            name: "Tour de France",
            date: "2025-07-05",
            type: "grand-tour",
            category: "Grand Tour",
            country: "France",
            status: "upcoming",
            timeLeft: "3 mois",
            betStatus: "soon",
            hasBet: false
        },
        {
            id: 3,
            name: "Milan-San Remo",
            date: "2025-03-22",
            type: "one-day",
            category: "Monument",
            country: "Italie",
            status: "finished",
            distance: "293 km",
            betStatus: "closed",
            winner: "Jasper Philipsen",
            hasBet: true,
        },
        {
            id: 5,
            name: "Tirreno-Adriatico",
            date: "2025-03-10",
            type: "stage-race",
            category: "World Tour",
            country: "Italie",
            status: "live",
            betStatus: "live",
            hasBet: true,
            currentLeader: "Remco Evenepoel"
        },
    ];

    const getStatusBadge = (status: string) => {
        type Status = 'live' | 'upcoming' | 'finished';
        const badges: Record<Status, { color: string; icon: React.ElementType; label: string; pulse: boolean; }> = {
            live: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Circle, label: 'EN DIRECT', pulse: true },
            upcoming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock, label: 'À venir', pulse: false },
            finished: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle, label: 'Terminée', pulse: false },
        };
        const badge = badges[status as Status] ?? badges.finished;
        const Icon = badge.icon;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
                <Icon className={`w-3 h-3 ${badge.pulse ? 'animate-pulse' : ''}`} />
                {badge.label}
            </span>
        );
    };

    const BetButton = ({ race }: { race: Race }) => {
        const betLink = race.type === 'grand-tour'
            ? `/leagues/${leagueId}/races/${race.id}/bet-grand-tour`
            : `/leagues/${leagueId}/races/${race.id}/bet`;

        if (race.betStatus === 'closed' || race.status === 'finished') {
            return <span className="px-3 py-1.5 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium border border-slate-600">Paris fermés</span>;
        }
        if (race.betStatus === 'live') {
            return <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium border border-orange-500/30">Course en cours</span>;
        }
        if (race.betStatus === 'soon') {
            return <span className="px-3 py-1.5 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium border border-slate-600">Bientôt disponible</span>;
        }
        if (race.hasBet) {
            return (
                <Link href={betLink} className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium border border-green-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-green-500/30 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    Pari placé
                </Link>
            );
        }
        return (
            <Link href={betLink} className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-lg text-sm font-semibold transition-all text-slate-900 flex items-center gap-1.5 transform hover:scale-105">
                Parier maintenant
                <ChevronRight className="w-4 h-4" />
            </Link>
        );
    };

    const filters = [
        { id: 'all', label: 'Toutes' },
        { id: 'upcoming', label: 'À venir' },
        { id: 'live', label: 'En direct' },
        { id: 'finished', label: 'Terminées' },
        { id: 'monuments', label: 'Monuments' },
        { id: 'grand-tours', label: 'Grands Tours' },
    ];

    const filteredRaces = races.filter(race => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'upcoming') return race.status === 'upcoming';
        if (selectedFilter === 'live') return race.status === 'live';
        if (selectedFilter === 'finished') return race.status === 'finished';
        if (selectedFilter === 'monuments') return race.category === 'Monument';
        if (selectedFilter === 'grand-tours') return race.type === 'grand-tour';
        return true;
    }).filter(race => {
        if (!searchQuery) return true;
        return race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            race.country.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Calendrier des courses</h2>
                </div>
            </div>
            <div className="space-y-4">
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
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                                selectedFilter === filter.id
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                {filteredRaces.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                        <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Aucune course trouvée</p>
                    </div>
                ) : (
                    filteredRaces.map((race) => (
                        <div key={race.id} className="bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-yellow-500/30 transition-all relative p-5">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <Link href={`/leagues/${leagueId}/races/${race.id}`} className="flex-1 space-y-3 block group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">{race.name}</h3>
                                                {getStatusBadge(race.status)}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(race.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                                {race.status === 'upcoming' && race.timeLeft && (
                                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Dans {race.timeLeft}</span>
                                                )}
                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{race.country}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">{race.category}</span>
                                        {race.distance && <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">{race.distance}</span>}
                                    </div>
                                    {race.status === 'finished' && race.winner && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Trophy className="w-4 h-4 text-yellow-400" />
                                            <span className="text-slate-300">Vainqueur:</span>
                                            <span className="font-semibold text-yellow-400">{race.winner}</span>
                                        </div>
                                    )}
                                    {race.status === 'live' && race.currentLeader && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
                                            <span className="text-slate-300">Leader actuel:</span>
                                            <span className="font-semibold text-yellow-400">{race.currentLeader}</span>
                                        </div>
                                    )}
                                </Link>
                                <div className="flex flex-col items-end gap-2 lg:min-w-[200px] z-10">
                                    <BetButton race={race} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}