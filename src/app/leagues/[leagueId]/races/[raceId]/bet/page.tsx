"use client";

import React, { useState, useEffect, useMemo, use } from 'react';
import { Trophy, Calendar, MapPin, Mountain, Star, Search, CheckCircle, Edit, Shield, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
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

    const getSelectionTitle = () => {
        if (!selectedWinner) return "Étape 1/2 : Choisis ton Vainqueur";
        if (!selectedBonusRider) return "Étape 2/2 : Choisis ton Coureur Bonus";
        return "Tes choix sont faits !";
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
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border border-yellow-500/30 p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{race.name}</h2>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">
                                    {RACE_TYPE_LABELS[race.type] || race.type}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />
                                    {new Date(race.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{race.nationality}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {isLiveOrFinished && !isBetConfirmed && (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3 text-orange-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        La course a déjà commencé, les paris sont fermés !
                    </div>
                )}

                {/* Unified Rider Selection */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            {isBetConfirmed ? "Pari Verrouillé" : getSelectionTitle()}
                        </h3>
                        <div className="text-sm text-slate-400">{riders.length} coureurs inscrits</div>
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
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredRiders.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                {riders.length === 0 ? "La startlist n'est pas encore disponible." : "Aucun coureur trouvé."}
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
                                        disabled={isBetConfirmed || isLiveOrFinished}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isWinner ? 'bg-yellow-500/20 border-yellow-500' :
                                                isBonus ? 'bg-purple-500/20 border-purple-500' :
                                                    'bg-slate-800/50 border-slate-700'
                                            } ${(isBetConfirmed || isLiveOrFinished) ? 'cursor-default opacity-80' : 'hover:border-slate-600'}`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                                                    {rider.countryCode ? (
                                                        <img
                                                            src={`https://flagcdn.com/w40/${rider.countryCode.toLowerCase()}.png`}
                                                            alt={rider.countryCode}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl font-bold text-slate-600">?</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-lg">{rider.fullName}</div>
                                                    <div className="text-sm text-slate-400">{team}</div>
                                                </div>
                                            </div>
                                            {isWinner && (
                                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30 flex items-center gap-1.5 min-w-max">
                                                    <Trophy className="w-4 h-4" /> Vainqueur
                                                </span>
                                            )}
                                            {isBonus && (
                                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30 flex items-center gap-1.5 min-w-max">
                                                    <Star className="w-4 h-4" /> Bonus
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Bet Summary and Validation */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xl font-bold mb-4">Récapitulatif de ton pari</h3>

                    {isBetConfirmed ? (
                        <div className="space-y-4 text-center">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                                <div className="flex items-center justify-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                    <h4 className="text-2xl font-bold text-green-400">Pari validé !</h4>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl">
                                <div className="text-sm text-slate-400 mb-1 flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-400" /> Vainqueur</div>
                                <div className="font-bold text-lg text-yellow-400">{riders.find(r => r.id === selectedWinner)?.fullName}</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl">
                                <div className="text-sm text-slate-400 mb-1 flex items-center gap-1.5"><Star className="w-4 h-4 text-purple-400" /> Coureur Bonus</div>
                                <div className="font-bold text-lg text-purple-400">{riders.find(r => r.id === selectedBonusRider)?.fullName}</div>
                            </div>
                            {!isLiveOrFinished && (
                                <button
                                    onClick={() => setIsBetConfirmed(false)}
                                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-5 h-5" />
                                    Modifier mon pari
                                </button>
                            )}
                        </div>
                    ) : (
                        (selectedWinner && selectedBonusRider) ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-800/50 rounded-xl">
                                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-400" /> Vainqueur</div>
                                    <div className="font-bold text-lg text-yellow-400">{riders.find(r => r.id === selectedWinner)?.fullName}</div>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-xl">
                                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-1.5"><Star className="w-4 h-4 text-purple-400" /> Coureur Bonus</div>
                                    <div className="font-bold text-lg text-purple-400">{riders.find(r => r.id === selectedBonusRider)?.fullName}</div>
                                </div>
                                {!isLiveOrFinished && (
                                    <button
                                        onClick={handleBetSubmit}
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                                        Valider et verrouiller mon pari
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <p>
                                    {!selectedWinner ? "Sélectionne un vainqueur pour commencer." : "Sélectionne maintenant ton coureur bonus."}
                                </p>
                            </div>
                        )
                    )}
                </section>
            </div>
        </div>
    );
}