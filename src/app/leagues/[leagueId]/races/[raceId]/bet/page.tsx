"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { Trophy, Calendar, MapPin, Mountain, Star, Search, CheckCircle, Edit, Shield, Loader2, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { raceService, type Race, type Rider, type Prediction } from '@/services/race.service';

const RACE_TYPE_LABELS: Record<string, string> = {
    GRAND_TOUR: 'Grand Tour',
    MONUMENT: 'Monument',
    STAGE_RACE: 'Course par étapes',
    CLASSIC: 'Classique',
    CHAMPIONSHIP: 'Championnat',
};

export default function BetPage({ params }: { params: Promise<{ leagueId: string, raceId: string }> }) {
    const { leagueId, raceId } = use(params);

    const [race, setRace] = useState<Race | null>(null);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [prediction, setPrediction] = useState<Prediction | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
    const [selectedBonusRider, setSelectedBonusRider] = useState<number | null>(null);
    const [isBetConfirmed, setIsBetConfirmed] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            raceService.getRaceById(raceId),
            raceService.getStartlist(raceId).catch(() => ({ data: { riders: [] } })),
            raceService.getPrediction(raceId).catch(() => ({ data: null }))
        ]).then(([raceRes, startlistRes, predRes]) => {
            setRace(raceRes.data);
            setRiders(startlistRes.data?.riders || []);

            if (predRes.data) {
                setPrediction(predRes.data);
                setSelectedWinner(predRes.data.favoriteRiderId);
                setSelectedBonusRider(predRes.data.bonusRiderId);
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
            const team = rider.team || rider.$extras?.pivot_team_name || '';
            return rider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm, riders]);

    const handleRiderClick = (riderId: number) => {
        if (isBetConfirmed) return;

        if (selectedWinner === riderId) {
            setSelectedWinner(null);
            setSelectedBonusRider(null);
        } else if (selectedBonusRider === riderId) {
            setSelectedBonusRider(null);
        } else if (!selectedWinner) {
            setSelectedWinner(riderId);
        } else {
            setSelectedBonusRider(riderId);
        }
    };

    const handleBetSubmit = async () => {
        if (!selectedWinner || !selectedBonusRider) return;

        setIsSubmitting(true);
        setError(null);

        try {
            if (prediction) {
                const res = await raceService.updatePrediction(prediction.id, selectedWinner, selectedBonusRider);
                setPrediction(res.data);
            } else {
                const res = await raceService.submitPrediction(raceId, selectedWinner, selectedBonusRider);
                if (res.data) setPrediction(res.data);
            }
            setIsBetConfirmed(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la validation du pari.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePrediction = async () => {
        if (!prediction) return;
        if (!window.confirm('Es-tu sûr de vouloir supprimer ton pronostic ?')) return;

        setIsDeleting(true);
        try {
            await raceService.deletePrediction(prediction.id);
            setPrediction(null);
            setSelectedWinner(null);
            setSelectedBonusRider(null);
            setIsBetConfirmed(false);
        } catch (err) {
            console.error('Failed to delete prediction:', err);
            alert('Erreur lors de la suppression du pronostic.');
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

    const selectedWinnerRider = riders.find(r => r.id === selectedWinner);
    const selectedBonusRiderRider = riders.find(r => r.id === selectedBonusRider);
    const bothSelected = selectedWinner && selectedBonusRider;

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-24">
            <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">

                {/* Header & Back Link */}
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
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

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
                    </div>
                </section>

                {isLiveOrFinished && !isBetConfirmed && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3 text-orange-400 shadow-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        La course a commencé, les pronostics sont clos !
                    </div>
                )}

                {/* Pronostic Summary (Top if confirmed, Bottom otherwise) */}
                <section className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl ${!isBetConfirmed ? 'order-last' : ''}`}>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <CheckCircle className={`w-7 h-7 ${isBetConfirmed ? 'text-green-500' : 'text-slate-600'}`} />
                        {isBetConfirmed ? "Ton pronostic validé" : "Récapitulatif de ton choix"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Winner */}
                        <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${selectedWinner ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'bg-slate-950 border-slate-800'}`}>
                            <div className="flex items-center gap-2 mb-3 text-sm text-slate-400 font-semibold uppercase tracking-wider">
                                <Trophy className={`w-5 h-5 ${selectedWinner ? 'text-yellow-500' : 'text-slate-600'}`} /> Vainqueur
                            </div>
                            <div className={`text-xl font-bold break-words ${selectedWinnerRider ? 'text-yellow-400' : 'text-slate-600'}`}>
                                {selectedWinnerRider?.fullName || 'Sélectionne un coureur'}
                            </div>
                        </div>

                        {/* Bonus */}
                        <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${selectedBonusRider ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-slate-950 border-slate-800'}`}>
                            <div className="flex items-center gap-2 mb-3 text-sm text-slate-400 font-semibold uppercase tracking-wider">
                                <Star className={`w-5 h-5 ${selectedBonusRider ? 'text-purple-500' : 'text-slate-600'}`} /> Coureur Bonus
                            </div>
                            <div className={`text-xl font-bold break-words ${selectedBonusRiderRider ? 'text-purple-400' : 'text-slate-600'}`}>
                                {selectedBonusRiderRider?.fullName || 'Sélectionne un coureur'}
                            </div>
                        </div>
                    </div>

                    {!isBetConfirmed && (selectedWinner || selectedBonusRider) && !isLiveOrFinished && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => { setSelectedWinner(null); setSelectedBonusRider(null); }}
                                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                Vider recommencer
                            </button>
                            {bothSelected && (
                                <button
                                    onClick={handleBetSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 rounded-xl font-extrabold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-yellow-500/20 hover:-translate-y-0.5"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
                                    {isSubmitting ? 'Validation...' : 'Verrouiller mon pronostic'}
                                </button>
                            )}
                        </div>
                    )}

                    {isBetConfirmed && !isLiveOrFinished && (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleDeletePrediction}
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
                                <Edit className="w-5 h-5 text-slate-400" /> Modifier mon pronostic
                            </button>
                        </div>
                    )}
                </section>

                {/* Rider List (Hidden if confirmed to save space) */}
                {!isBetConfirmed && (
                    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
                        <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                                Liste de départ ({riders.length})
                            </h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Rechercher (Nom, Equipe...)"
                                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 md:text-lg focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all shadow-inner"
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
                                    const isWinner = selectedWinner === rider.id;
                                    const isBonus = selectedBonusRider === rider.id;
                                    const team = rider.team || rider.$extras?.pivot_team_name;

                                    return (
                                        <button
                                            key={rider.id}
                                            onClick={() => handleRiderClick(rider.id)}
                                            disabled={isLiveOrFinished}
                                            className={`group w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4
                                                ${isWinner ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                                                    isBonus ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' :
                                                        'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 shadow-sm'
                                                } ${isLiveOrFinished ? 'cursor-default opacity-50' : 'hover:-translate-y-0.5'}`}
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
                                                    <div className={`text-xl font-bold mb-1 transition-colors break-words line-clamp-2 ${isWinner ? 'text-yellow-400' : isBonus ? 'text-purple-400' : 'text-slate-100 group-hover:text-white'}`}>
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
                                                {!isWinner && !isBonus && !isLiveOrFinished && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 group-hover:border-slate-500 transition-colors flex items-center justify-center bg-slate-950">
                                                        <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors opacity-0 group-hover:opacity-100"></div>
                                                    </div>
                                                )}
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