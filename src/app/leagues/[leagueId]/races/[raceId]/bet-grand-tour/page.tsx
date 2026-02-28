"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { Calendar, MapPin, Mountain, Search, CheckCircle, Users, Edit, Shield, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { raceService, type Race, type Rider, type FantasyTeam } from '@/services/race.service';

const MAX_TEAM_SIZE = 8;

export default function BetGrandTourPage({ params }: { params: Promise<{ leagueId: string, raceId: string }> }) {
    const { leagueId, raceId } = use(params);

    const [race, setRace] = useState<Race | null>(null);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [team, setTeam] = useState<FantasyTeam | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedTeam, setSelectedTeam] = useState<number[]>([]);
    const [isBetConfirmed, setIsBetConfirmed] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            raceService.getRaceById(raceId),
            raceService.getStartlist(raceId).catch(() => ({ data: { riders: [] } })),
            raceService.getFantasyTeam(raceId).catch(() => ({ data: null }))
        ]).then(([raceRes, startlistRes, teamRes]) => {
            setRace(raceRes.data);
            setRiders(startlistRes.data?.riders || []);

            if (teamRes.data) {
                setTeam(teamRes.data);
                setSelectedTeam(teamRes.data.riders.map(r => r.id));
                setIsBetConfirmed(true);
            }
        }).catch(() => {
            setError('Impossible de charger les informations nécessaires.');
        }).finally(() => {
            setIsLoading(false);
        });
    }, [raceId]);

    const filteredRiders = useMemo(() => {
        if (!searchTerm) return riders;
        return riders.filter(rider => {
            const teamStr = rider.team || rider.$extras?.pivot_team_name || '';
            return rider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teamStr.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm, riders]);

    const handleRiderSelect = (riderId: number) => {
        if (isBetConfirmed) return;

        setSelectedTeam(prevTeam => {
            if (prevTeam.includes(riderId)) {
                return prevTeam.filter(id => id !== riderId);
            }
            if (prevTeam.length < MAX_TEAM_SIZE) {
                return [...prevTeam, riderId];
            }
            return prevTeam;
        });
    };

    const handleBetSubmit = async () => {
        if (selectedTeam.length !== MAX_TEAM_SIZE) return;

        setIsSubmitting(true);
        setError(null);

        try {
            if (team) {
                const res = await raceService.updateFantasyTeam(team.id, selectedTeam);
                setTeam(res.data);
            } else {
                const res = await raceService.submitFantasyTeam(raceId, selectedTeam);
                if (res.data) setTeam(res.data);
            }
            setIsBetConfirmed(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la validation de l\'équipe.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (!race) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 max-w-md">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error || "Course introuvable"}
                </div>
            </div>
        );
    }

    const isLiveOrFinished = new Date(race.startDate) <= new Date();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

                <Link
                    href={`/leagues/${leagueId}/races/${raceId}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-max"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la course
                </Link>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Race Info */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 border border-purple-500/30 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{race.name}</h2>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">
                                    Grand Tour
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />
                                    {new Date(race.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{race.nationality}</span>
                                <span className="flex items-center gap-1.5"><Mountain className="w-4 h-4" />21 étapes</span>
                            </div>
                        </div>
                    </div>
                </section>

                {isLiveOrFinished && !isBetConfirmed && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3 text-orange-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        La course a déjà commencé, la création d'équipe est fermée !
                    </div>
                )}

                {/* Team Selection */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-yellow-400" />
                            Compose ton équipe ({selectedTeam.length}/{MAX_TEAM_SIZE})
                        </h3>
                    </div>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un coureur..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isBetConfirmed || isLiveOrFinished}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredRiders.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-slate-400">
                                {riders.length === 0 ? "La startlist n'est pas encore disponible." : "Aucun coureur trouvé."}
                            </div>
                        ) : (
                            filteredRiders.map((rider) => {
                                const isSelected = selectedTeam.includes(rider.id);
                                const riderTeamStr = rider.team || rider.$extras?.pivot_team_name;

                                return (
                                    <button
                                        key={rider.id}
                                        onClick={() => handleRiderSelect(rider.id)}
                                        disabled={isBetConfirmed || isLiveOrFinished}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${isSelected ? 'bg-yellow-500/20 border-yellow-500' : 'bg-slate-800/50 border-slate-700'
                                            } ${(isBetConfirmed || isLiveOrFinished) ? 'cursor-default opacity-80' : 'hover:border-slate-600'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${isSelected ? 'bg-yellow-400 border-yellow-300' : 'border-slate-600 bg-slate-800'}`}>
                                            {isSelected && <CheckCircle className="w-4 h-4 text-slate-900" />}
                                        </div>

                                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {rider.countryCode ? (
                                                <img
                                                    src={`https://flagcdn.com/w40/${rider.countryCode.toLowerCase()}.png`}
                                                    alt={rider.countryCode}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs font-bold text-slate-600">?</span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold truncate">{rider.fullName}</div>
                                            <div className="text-xs text-slate-400 truncate">{riderTeamStr}</div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Bet Summary and Validation */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xl font-bold mb-4">Récapitulatif de ton équipe</h3>
                    {isBetConfirmed ? (
                        <div className="space-y-4 text-center">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                                <div className="flex items-center justify-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                    <h4 className="text-2xl font-bold text-green-400">Équipe validée !</h4>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                                {selectedTeam.map(riderId => {
                                    const rider = riders.find(r => r.id === riderId);
                                    if (!rider) return null;
                                    return (
                                        <div key={rider.id} className="bg-slate-800 rounded-lg p-3 text-sm flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                            <span className="truncate">{rider.fullName}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {!isLiveOrFinished && (
                                <button
                                    onClick={() => setIsBetConfirmed(false)}
                                    className="w-full mt-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-5 h-5" />
                                    Modifier mon équipe
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleBetSubmit}
                            disabled={selectedTeam.length !== MAX_TEAM_SIZE || isSubmitting || isLiveOrFinished}
                            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:from-yellow-600 enabled:hover:to-amber-700 enabled:transform enabled:hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Shield className="w-5 h-5" />
                            )}
                            Valider mon équipe ({selectedTeam.length}/{MAX_TEAM_SIZE})
                        </button>
                    )}
                </section>
            </div>
        </div>
    );
}
