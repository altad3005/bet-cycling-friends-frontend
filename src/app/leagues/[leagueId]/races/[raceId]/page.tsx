"use client";

import React, { useState, useEffect, use } from 'react';
import { Calendar, MapPin, Trophy, ChevronRight, Users, BarChart3, Loader2, AlertCircle, Mountain, CheckCircle, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { raceService, type Race, type Prediction, type FantasyTeam } from '@/services/race.service';

const RACE_TYPE_LABELS: Record<string, string> = {
    GRAND_TOUR: 'Grand Tour',
    MONUMENT: 'Monument',
    STAGE_RACE: 'Course par étapes',
    CLASSIC: 'Classique',
    CHAMPIONSHIP: 'Championnat',
};

const renderProfileIcon = (profile: string) => {
    switch (profile) {
        case 'p1': return <div className="flex gap-0.5" title="Plat"><Mountain className="w-4 h-4 text-green-400 opacity-50" /></div>;
        case 'p2': return <div className="flex gap-0.5" title="Vallonné"><Mountain className="w-4 h-4 text-yellow-500 opacity-80" /></div>;
        case 'p3': return <div className="flex gap-0.5" title="Moyenne montagne"><Mountain className="w-4 h-4 text-orange-500" /><Mountain className="w-4 h-4 text-orange-500" /></div>;
        case 'p4': return <div className="flex gap-0.5" title="Montagne"><Mountain className="w-4 h-4 text-red-500" /><Mountain className="w-4 h-4 text-red-500" /></div>;
        case 'p5': return <div className="flex gap-0.5" title="Haute montagne"><Mountain className="w-4 h-4 text-red-600" /><Mountain className="w-4 h-4 text-red-600" /><Mountain className="w-4 h-4 text-red-600" /></div>;
        default: return <span className="text-xs text-slate-500 font-mono uppercase px-1.5 py-0.5 bg-slate-800 rounded">{profile}</span>;
    }
};

const RaceDetailPage = ({ params }: { params: Promise<{ leagueId: string, raceId: string }> }) => {
    const { leagueId, raceId } = use(params);

    const [race, setRace] = useState<Race | null>(null);
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [fantasyTeam, setFantasyTeam] = useState<FantasyTeam | null>(null);

    const [allPredictions, setAllPredictions] = useState<Prediction[]>([]);
    const [allFantasyTeams, setAllFantasyTeams] = useState<FantasyTeam[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = () => {
        setIsLoading(true);
        raceService.getRaceById(raceId)
            .then((res) => {
                const fetchedRace = res.data;
                setRace(fetchedRace);
                const now = new Date();
                const isFinished = now > new Date(fetchedRace.endDate);

                if (fetchedRace.type === 'GRAND_TOUR') {
                    const promises: Promise<any>[] = [raceService.getFantasyTeam(raceId).then(pRes => setFantasyTeam(pRes.data)).catch(() => { })];
                    if (isFinished) {
                        promises.push(raceService.getRaceFantasyTeams(raceId).then(res => setAllFantasyTeams(res.data)).catch(() => { }));
                    }
                    return Promise.all(promises);
                } else {
                    const promises: Promise<any>[] = [raceService.getPrediction(raceId).then(pRes => setPrediction(pRes.data)).catch(() => { })];
                    if (isFinished) {
                        promises.push(raceService.getRacePredictions(raceId).then(res => setAllPredictions(res.data)).catch(() => { }));
                    }
                    return Promise.all(promises);
                }
            })
            .catch(() => setError('Impossible de charger les détails de cette course.'))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadData();
    }, [raceId]);

    const handleDeletePrediction = async () => {
        if (!prediction) return;
        if (!window.confirm('Es-tu sûr de vouloir supprimer ton pronostic ?')) return;

        setIsDeleting(true);
        try {
            await raceService.deletePrediction(prediction.id);
            setPrediction(null);
        } catch (err) {
            console.error('Failed to delete prediction:', err);
            alert('Erreur lors de la suppression du pronostic.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteFantasyTeam = async () => {
        if (!fantasyTeam) return;
        if (!window.confirm('Es-tu sûr de vouloir supprimer ton équipe ?')) return;

        setIsDeleting(true);
        try {
            await raceService.deleteFantasyTeam(fantasyTeam.id);
            setFantasyTeam(null);
        } catch (err) {
            console.error('Failed to delete fantasy team:', err);
            alert('Erreur lors de la suppression de l\'équipe.');
        } finally {
            setIsDeleting(false);
        }
    };

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

            {/* User Prediction (Classic) */}
            {prediction && (
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -z-10"></div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Ton Pronostic Actuel
                        </h3>
                        {status !== 'finished' && (
                            <button
                                onClick={handleDeletePrediction}
                                disabled={isDeleting}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                title="Supprimer le pronostic"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                <span className="hidden sm:inline">Supprimer</span>
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 flex-shrink-0">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Vainqueur</div>
                                <div className="font-semibold text-yellow-400">{prediction.favoriteRider.fullName}</div>
                            </div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                                <Star className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase mb-0.5">Bonus</div>
                                <div className="font-semibold text-purple-400">{prediction.bonusRider.fullName}</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* User Fantasy Team (Grand Tour) */}
            {fantasyTeam && fantasyTeam.riders && fantasyTeam.riders.length > 0 && (
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -z-10"></div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Ton Équipe
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">
                                {fantasyTeam.riders.length} coureurs
                            </span>
                            {status !== 'finished' && (
                                <button
                                    onClick={handleDeleteFantasyTeam}
                                    disabled={isDeleting}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Supprimer l'équipe"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {fantasyTeam.riders.map(rider => (
                            <div key={rider.id} className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {rider.countryCode ? (
                                        <img src={`https://flagcdn.com/w20/${rider.countryCode.toLowerCase()}.png`} alt="" className="w-full h-full object-cover" />
                                    ) : <Users className="w-3 h-3 text-slate-500" />}
                                </div>
                                <span className="truncate text-slate-200">{rider.fullName}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Missing Bet Indicator */}
            {!prediction && (!fantasyTeam || !fantasyTeam.riders || fantasyTeam.riders.length === 0) && status !== 'finished' && (
                <section className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-8 text-center shadow-sm">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                        <Trophy className="w-8 h-8 text-yellow-500/50" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Aucun pari en cours</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Tu n'as pas encore fait de pronostic pour cette course. N'oublie pas de valider tes choix avant le départ !
                    </p>
                </section>
            )}

            {/* Action Buttons */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {status !== 'finished' && (
                    <Link
                        href={betLink}
                        className={`w-full p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 ${prediction || fantasyTeam ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900'}`}
                    >
                        <Trophy className={`w-5 h-5 ${prediction || fantasyTeam ? 'text-yellow-500' : ''}`} />
                        {prediction || fantasyTeam ? 'Voir / Modifier mon pari' : 'Parier sur la course'}
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

            {/* Stages List (For Grand Tours / Stage Races) */}
            {race.stages && race.stages.length > 0 && (
                <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-8">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-400" />
                            Étapes ({race.stages.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {race.stages.map((stage) => {
                            const stageDate = stage.date ? new Date(stage.date) : null;
                            const isPast = stageDate ? stageDate < now && stageDate.toDateString() !== now.toDateString() : false;
                            const isToday = stageDate ? stageDate.toDateString() === now.toDateString() : false;

                            return (
                                <div key={stage.id} className={`p-4 md:px-6 flex items-center gap-4 hover:bg-slate-800/30 transition-colors ${isPast ? 'opacity-60' : ''} ${isToday ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : ''}`}>
                                    <div className="flex-shrink-0 w-12 text-center">
                                        <div className="text-xs text-slate-500 uppercase font-semibold">Étape</div>
                                        <div className={`text-xl font-bold ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>{stage.stageNumber}</div>
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <div className="font-bold text-slate-200 truncate">{stage.name}</div>
                                            {stageDate && (
                                                <div className="text-sm text-slate-500 mt-0.5">
                                                    {stageDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0 self-start sm:self-auto">
                                            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-center min-w-[3rem]">
                                                {renderProfileIcon(stage.profileIcon)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* League Bets (if finished) */}
            {status === 'finished' && race.type !== 'GRAND_TOUR' && allPredictions.length > 0 && (
                <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-8">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/95 flex items-center gap-3">
                        <Users className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-xl font-bold text-white">Paris de la ligue</h3>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {allPredictions.map((pred) => (
                            <div key={pred.id} className="p-4 md:px-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-3 md:w-1/4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                                        {pred.user?.icone ? (
                                            <span className="text-xl w-full h-full flex items-center justify-center">{pred.user.icone}</span>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 font-bold">
                                                {pred.user?.pseudo?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="font-bold text-slate-200">{pred.user?.pseudo}</div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50 flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-slate-300 truncate">{pred.favoriteRider.fullName}</span>
                                    </div>
                                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/50 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm font-medium text-slate-300 truncate">{pred.bonusRider.fullName}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {status === 'finished' && race.type === 'GRAND_TOUR' && allFantasyTeams.length > 0 && (
                <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-8">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/95 flex items-center gap-3">
                        <Users className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-xl font-bold text-white">Équipes de la ligue</h3>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {allFantasyTeams.map((team) => (
                            <div key={team.id} className="p-4 md:px-6 hover:bg-slate-800/30 transition-colors space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                                        {team.user?.icone ? (
                                            <span className="text-xl w-full h-full flex items-center justify-center">{team.user.icone}</span>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-500/20 text-indigo-400 font-bold">
                                                {team.user?.pseudo?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="font-bold text-slate-200">{team.user?.pseudo}</div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {team.riders && team.riders.map(rider => (
                                        <div key={rider.id} className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 text-xs text-slate-300 truncate flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50"></div>
                                            {rider.fullName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Race Results (if finished) - TODO: Need league-specific ranking endpoint */}
            {status === 'finished' && (
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 text-center py-12 mt-8">
                    <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">Classement de la ligue</h3>
                    <p className="text-slate-500">Le calcul des points pour cette course arrive bientôt.</p>
                </section>
            )}
        </div>
    );
};

export default RaceDetailPage;