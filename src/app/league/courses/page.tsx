"use client";

import React, { useState } from 'react';
import { Home, Calendar, BarChart3, Info, Users, Trophy, Clock, MapPin, ChevronRight, Search, CheckCircle, Circle, Mountain, Wind, TrendingUp } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

export default function RacesCalendarPage() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const leagueName = "Les Grimpeurs Fous";

    // Données mock des courses
    const races = [
        {
            id: 1,
            name: "Paris-Roubaix",
            date: "2025-04-13",
            time: "10:30",
            type: "one-day",
            category: "Monument",
            country: "France",
            status: "upcoming",
            timeLeft: "2h 15min",
            terrain: "pavés",
            distance: "257 km",
            betStatus: "pending",
            participants: 176,
            favorites: ["Van der Poel", "Van Aert", "Ganna"],
            hasBet: false
        },
        {
            id: 2,
            name: "Tour des Flandres",
            date: "2025-04-06",
            time: "10:15",
            type: "one-day",
            category: "Monument",
            country: "Belgique",
            status: "upcoming",
            timeLeft: "1 semaine",
            terrain: "collines",
            distance: "272 km",
            betStatus: "open",
            participants: 175,
            favorites: ["Pogačar", "Van der Poel", "Evenepoel"],
            hasBet: true
        },
        {
            id: 3,
            name: "Milan-San Remo",
            date: "2025-03-22",
            time: "09:45",
            type: "one-day",
            category: "Monument",
            country: "Italie",
            status: "finished",
            terrain: "plat",
            distance: "293 km",
            betStatus: "closed",
            participants: 200,
            winner: "Jasper Philipsen",
            hasBet: true,
            pointsEarned: 50
        },
        {
            id: 4,
            name: "Tour de France",
            date: "2025-07-05",
            time: "13:30",
            type: "grand-tour",
            category: "Grand Tour",
            country: "France",
            status: "upcoming",
            timeLeft: "3 mois",
            terrain: "varié",
            stages: 21,
            betStatus: "soon",
            participants: 176,
            hasBet: false
        },
        {
            id: 5,
            name: "Tirreno-Adriatico",
            date: "2025-03-10",
            time: "11:00",
            type: "stage-race",
            category: "World Tour",
            country: "Italie",
            status: "live",
            terrain: "varié",
            currentStage: 5,
            stages: 7,
            betStatus: "live",
            participants: 168,
            hasBet: true,
            currentLeader: "Remco Evenepoel"
        },
        {
            id: 6,
            name: "Gand-Wevelgem",
            date: "2025-03-30",
            time: "10:45",
            type: "one-day",
            category: "World Tour",
            country: "Belgique",
            status: "upcoming",
            timeLeft: "2 semaines",
            terrain: "plat/vent",
            distance: "251 km",
            betStatus: "open",
            participants: 173,
            favorites: ["Pedersen", "Laporte", "Ackermann"],
            hasBet: false
        },
        {
            id: 7,
            name: "Liège-Bastogne-Liège",
            date: "2025-04-27",
            time: "10:20",
            type: "one-day",
            category: "Monument",
            country: "Belgique",
            status: "upcoming",
            timeLeft: "1 mois",
            terrain: "montagne",
            distance: "259 km",
            betStatus: "soon",
            participants: 175,
            favorites: ["Pogačar", "Roglic", "Evenepoel"],
            hasBet: false
        },
        {
            id: 8,
            name: "Amstel Gold Race",
            date: "2025-04-20",
            time: "10:30",
            type: "one-day",
            category: "World Tour",
            country: "Pays-Bas",
            status: "upcoming",
            timeLeft: "3 semaines",
            terrain: "collines",
            distance: "254 km",
            betStatus: "open",
            participants: 174,
            favorites: ["Pogačar", "Van der Poel", "Alaphilippe"],
            hasBet: false
        }
    ];

    const getStatusBadge = (status: string) => {
        type Status = 'live' | 'upcoming' | 'finished';

        const badges: Record<Status, {
            color: string;
            icon: React.ElementType;
            label: string;
            pulse: boolean;
        }> = {
            live: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Circle, label: 'EN DIRECT', pulse: true },
            upcoming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock, label: 'À venir', pulse: false },
            finished: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle, label: 'Terminée', pulse: false },
        };

        // Si le status ne correspond à rien, on met une valeur par défaut
        const badge = badges[status as Status] ?? badges.finished;
        const Icon = badge.icon;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
            <Icon className={`w-3 h-3 ${badge.pulse ? 'animate-pulse' : ''}`} />
                {badge.label}
        </span>
        );
    };

    const getBetStatusBadge = (betStatus: string, hasBet: boolean) => {
        if (betStatus === 'closed') {
            return (
                <span className="px-3 py-1.5 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium border border-slate-600">
          Paris fermés
        </span>
            );
        }
        if (betStatus === 'live') {
            return (
                <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium border border-orange-500/30">
          Course en cours
        </span>
            );
        }
        if (betStatus === 'soon') {
            return (
                <span className="px-3 py-1.5 bg-slate-700 text-slate-400 rounded-lg text-sm font-medium border border-slate-600">
          Bientôt disponible
        </span>
            );
        }
        if (hasBet) {
            return (
                <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium border border-green-500/30 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" />
          Pari placé
        </span>
            );
        }
        return (
            <button className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-lg text-sm font-semibold transition-all text-slate-900 flex items-center gap-1.5">
                Parier maintenant
                <ChevronRight className="w-4 h-4" />
            </button>
        );
    };

    const getTerrainIcon = (terrain: string | string[]) => {
        if (terrain.includes('montagne') || terrain.includes('collines')) return <Mountain className="w-4 h-4" />;
        if (terrain.includes('vent')) return <Wind className="w-4 h-4" />;
        return <MapPin className="w-4 h-4" />;
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
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            <Link href={"/league"}>Home</Link>
                        </button>
                        <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 border border-yellow-500/30">
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
                {/* Header de page */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Calendrier des courses</h2>
                        <p className="text-slate-400">Consultez toutes les courses du World Tour et placez vos paris</p>
                    </div>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="space-y-4">
                    {/* Recherche */}
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

                    {/* Filtres */}
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

                {/* Liste des courses */}
                <div className="space-y-4">
                    {filteredRaces.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">Aucune course trouvée</p>
                        </div>
                    ) : (
                        filteredRaces.map((race) => (
                            <div
                                key={race.id}
                                className="bg-slate-900/50 rounded-2xl p-5 border border-slate-800 hover:border-yellow-500/30 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Info principale */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">
                                                        {race.name}
                                                    </h3>
                                                    {getStatusBadge(race.status)}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                              {new Date(race.date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                              })}
                          </span>
                                                    {race.status === 'upcoming' && race.timeLeft && (
                                                        <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              Dans {race.timeLeft}
                            </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                                                        {race.country}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Infos supplémentaires */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700 flex items-center gap-1.5">
                        {getTerrainIcon(race.terrain)}
                          {race.terrain}
                      </span>
                                            <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                        {race.category}
                      </span>
                                            {race.type === 'grand-tour' && (
                                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                          {race.stages} étapes
                        </span>
                                            )}
                                            {race.type === 'stage-race' && race.currentStage && (
                                                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg border border-orange-500/30">
                          Étape {race.currentStage}/{race.stages}
                        </span>
                                            )}
                                            {race.distance && (
                                                <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
                          {race.distance}
                        </span>
                                            )}
                                        </div>

                                        {/* Favoris ou résultat */}
                                        {race.status === 'finished' && race.winner && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Trophy className="w-4 h-4 text-yellow-400" />
                                                <span className="text-slate-300">Vainqueur:</span>
                                                <span className="font-semibold text-yellow-400">{race.winner}</span>
                                                {race.pointsEarned && (
                                                    <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            +{race.pointsEarned} pts
                          </span>
                                                )}
                                            </div>
                                        )}
                                        {race.status === 'live' && race.currentLeader && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Trophy className="w-4 h-4 text-yellow-400 animate-pulse" />
                                                <span className="text-slate-300">Leader actuel:</span>
                                                <span className="font-semibold text-yellow-400">{race.currentLeader}</span>
                                            </div>
                                        )}
                                        {race.favorites && race.status === 'upcoming' && (
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>Favoris:</span>
                                                <span className="text-slate-300">{race.favorites.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA */}
                                    <div className="flex flex-col items-end gap-2 lg:min-w-[200px]">
                                        {getBetStatusBadge(race.betStatus, race.hasBet)}
                                        <button className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
                                            Voir les détails
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}