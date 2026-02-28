"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { Calendar, MapPin, Mountain, Search, CheckCircle, Users, Edit, Shield, Loader2, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';
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
    const [isDeleting, setIsDeleting] = useState(false);
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

    const handleDeleteTeam = async () => {
        if (!team) return;
        if (!window.confirm('Es-tu sûr de vouloir supprimer ton équipe ?')) return;

        setIsDeleting(true);
        try {
            await raceService.deleteFantasyTeam(team.id);
            setTeam(null);
            setSelectedTeam([]);
            setIsBetConfirmed(false);
        } catch (err) {
            console.error('Failed to delete team:', err);
            alert('Erreur lors de la suppression de l\'équipe.');
        } finally {
            setIsDeleting(false);
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

                <div className="space-y-4">
                    <Link
                        href={`/leagues/${leagueId}/races/${raceId}`}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la course
                    </Link>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Race Info Overview */}
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                    <div className="inline-block px-3 py-1 bg-slate-800 rounded-full border border-slate-700 mb-4">
                        <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">
                            Grand Tour
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
                        <span className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                            <Mountain className="w-4 h-4 text-slate-500" />
                            21 étapes
                        </span>
                    </div>
                </section>

                {isLiveOrFinished && !isBetConfirmed && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3 text-orange-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        La course a déjà commencé, la création d'équipe est fermée !
                    </div>
                )}

                {/* Team Summary & Actions (Top if confirmed, Bottom otherwise) */}
                <section className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl ${!isBetConfirmed ? 'order-last' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <CheckCircle className={`w-7 h-7 ${isBetConfirmed ? 'text-green-500' : 'text-slate-600'}`} />
                            {isBetConfirmed ? "Ton équipe validée" : "Récapitulatif de ton équipe"}
                        </h3>
                        {(!isBetConfirmed || isLiveOrFinished) && (
                            <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-400" />
                                {selectedTeam.length} / {MAX_TEAM_SIZE}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {Array.from({ length: MAX_TEAM_SIZE }).map((_, index) => {
                            const riderId = selectedTeam[index];
                            const rider = riderId ? riders.find(r => r.id === riderId) : null;

                            return (
                                <div key={index} className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${rider ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-slate-950 border-slate-800 border-dashed'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${rider ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        {rider ? (
                                            <div className="text-sm font-bold text-slate-200 truncate">{rider.fullName}</div>
                                        ) : (
                                            <div className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Vide</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {!isBetConfirmed && selectedTeam.length > 0 && !isLiveOrFinished && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setSelectedTeam([])}
                                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                Vider recommencer
                            </button>
                            {selectedTeam.length === MAX_TEAM_SIZE && (
                                <button
                                    onClick={handleBetSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white rounded-xl font-extrabold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
                                    {isSubmitting ? 'Validation...' : 'Verrouiller mon équipe'}
                                </button>
                            )}
                        </div>
                    )}

                    {isBetConfirmed && !isLiveOrFinished && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDeleteTeam}
                                disabled={isDeleting}
                                className="sm:w-1/3 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all flex items-center justify-center gap-3 border border-red-500/20 hover:border-red-500/30 shadow-sm"
                            >
                                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                Supprimer
                            </button>
                            <button
                                onClick={() => setIsBetConfirmed(false)}
                                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-600 shadow-sm"
                            >
                                <Edit className="w-5 h-5 text-slate-400" /> Modifier mon équipe
                            </button>
                        </div>
                    )}
                </section>

                {/* Rider Selection List (Hidden if confirmed) */}
                {!isBetConfirmed && (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
                        <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                <Users className="w-6 h-6 text-indigo-400" />
                                Liste de départ ({riders.length})
                            </h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Rechercher (Nom, Equipe...)"
                                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 md:text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={isLiveOrFinished}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar bg-slate-950/30 max-h-[800px]">
                            {filteredRiders.length === 0 ? (
                                <div className="text-center py-16 text-slate-400">
                                    <Mountain className="w-16 h-16 mx-auto mb-6 opacity-20 text-slate-500" />
                                    <p className="text-lg">Aucun coureur trouvé.</p>
                                </div>
                            ) : (
                                filteredRiders.map((rider) => {
                                    const isSelected = selectedTeam.includes(rider.id);
                                    const team = rider.team || rider.$extras?.pivot_team_name;
                                    const isMaxReached = selectedTeam.length >= MAX_TEAM_SIZE && !isSelected;

                                    return (
                                        <button
                                            key={rider.id}
                                            onClick={() => handleRiderSelect(rider.id)}
                                            disabled={isLiveOrFinished || isMaxReached}
                                            className={`group w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4
                                                ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' :
                                                    'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 shadow-sm'
                                                } ${(isLiveOrFinished || isMaxReached) ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5'}`}
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
                                                    <div className={`text-xl font-bold mb-1 transition-colors break-words line-clamp-2 ${isSelected ? 'text-indigo-400' : 'text-slate-100 group-hover:text-white'}`}>
                                                        {rider.fullName}
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-400">{team}</div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 sm:ml-auto flex-shrink-0 mt-2 sm:mt-0">
                                                {isSelected ? (
                                                    <div className="w-8 h-8 rounded-full border-2 border-indigo-400 flex items-center justify-center bg-indigo-500/20 text-indigo-400">
                                                        <CheckCircle className="w-5 h-5" />
                                                    </div>
                                                ) : !isLiveOrFinished ? (
                                                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 group-hover:border-slate-500 transition-colors flex items-center justify-center bg-slate-950">
                                                        <div className="w-4 h-4 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-950">
                                                            +
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
