"use client";

import React, { useState } from 'react';
import { Home, Calendar, BarChart3, Trophy, Clock, MapPin, ChevronRight, Star, Zap, Shield, Flame, TrendingUp, Mountain, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function BetPage() {
    const [selectedRider, setSelectedRider] = useState<number | null>(null);
    const [selectedBonus, setSelectedBonus] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const leagueName = "Les Grimpeurs Fous";

    // Données de la course
    const race = {
        name: "Paris-Roubaix",
        date: "Dimanche 13 avril 2025",
        time: "10:30",
        country: "France",
        distance: "257 km",
        terrain: "Pavés",
        category: "Monument",
        timeLeft: "2h 15min",
        deadline: "10:30",
        profile: "Plat avec secteurs pavés",
        weather: "Nuageux, 12°C, vent 15 km/h"
    };

    // Startlist avec favoris
    const riders = [
        { id: 1, name: "Mathieu van der Poel", team: "Alpecin-Deceuninck", country: "🇳🇱", odds: 3.5, form: "excellent", popularity: 45, recent: "1er Milano-Sanremo" },
        { id: 2, name: "Wout van Aert", team: "Visma-Lease a Bike", country: "🇧🇪", odds: 4.0, form: "excellent", popularity: 38, recent: "2e E3 Saxo Classic" },
        { id: 3, name: "Filippo Ganna", team: "INEOS Grenadiers", country: "🇮🇹", odds: 8.0, form: "good", popularity: 22, recent: "5e Milano-Sanremo" },
        { id: 4, name: "Jasper Philipsen", team: "Alpecin-Deceuninck", country: "🇧🇪", odds: 10.0, form: "good", popularity: 18, recent: "1er Milano-Sanremo" },
        { id: 5, name: "Mads Pedersen", team: "Lidl-Trek", country: "🇩🇰", odds: 12.0, form: "good", popularity: 15, recent: "3e Gand-Wevelgem" },
        { id: 6, name: "Stefan Küng", team: "Groupama-FDJ", country: "🇨🇭", odds: 15.0, form: "average", popularity: 12, recent: "8e E3 Saxo Classic" },
        { id: 7, name: "Christophe Laporte", team: "Visma-Lease a Bike", country: "🇫🇷", odds: 18.0, form: "average", popularity: 10, recent: "12e Milano-Sanremo" },
        { id: 8, name: "Nils Politt", team: "UAE Team Emirates", country: "🇩🇪", odds: 20.0, form: "average", popularity: 8, recent: "15e Gand-Wevelgem" }
    ];

    // Bonus disponibles
    const bonuses = [
        {
            id: 'bordure',
            name: 'Coup de bordure',
            icon: Zap,
            description: 'Double tes points sur cette course',
            available: true,
            color: 'from-yellow-500 to-amber-600',
            limit: '1/mois'
        },
        {
            id: 'pneu',
            name: 'Pneu crevé',
            icon: Shield,
            description: 'Bloque le choix d\'un adversaire',
            available: true,
            color: 'from-red-500 to-orange-600',
            limit: '3/saison'
        },
        {
            id: 'audace',
            name: 'Audace',
            icon: Star,
            description: 'Bonus si ton coureur est unique dans la ligue',
            available: true,
            color: 'from-purple-500 to-pink-600',
            limit: 'Illimité'
        }
    ];

    const getFormColor = (form: string) => {
        if (form === 'excellent') return 'text-green-400';
        if (form === 'good') return 'text-blue-400';
        return 'text-slate-400';
    };

    const getFormLabel = (form: string) => {
        if (form === 'excellent') return 'Excellente';
        if (form === 'good') return 'Bonne';
        return 'Moyenne';
    };

    const handleBetSubmit = () => {
        if (selectedRider) {
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
            {/* Header avec navigation */}
            <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold">{leagueName}</h1>
                                <p className="text-xs text-slate-400">Placer un pari</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-semibold">Deadline dans {race.timeLeft}</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Home
                        </button>
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Courses
                        </button>
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium whitespace-nowrap hover:bg-slate-700 transition-colors flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Stats
                        </button>
                    </nav>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Info course */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border border-yellow-500/30 p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>

                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                    {race.name}
                                </h2>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">
                  {race.category}
                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                    {race.date} • {race.time}
                </span>
                                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                                    {race.country}
                </span>
                                <span className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4" />
                                    {race.distance}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Terrain</div>
                            <div className="font-semibold text-yellow-400">{race.terrain}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Profil</div>
                            <div className="font-semibold">{race.profile}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Météo</div>
                            <div className="font-semibold">{race.weather}</div>
                        </div>
                    </div>
                </section>

                {/* Choix du coureur */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            Choisis ton coureur
                        </h3>
                        <div className="text-sm text-slate-400">
                            {riders.length} coureurs inscrits
                        </div>
                    </div>

                    <div className="space-y-3">
                        {riders.map((rider) => (
                            <button
                                key={rider.id}
                                onClick={() => setSelectedRider(rider.id)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                    selectedRider === rider.id
                                        ? 'bg-yellow-500/20 border-yellow-500 shadow-lg shadow-yellow-500/20'
                                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900">
                                            {rider.country}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="font-bold text-lg">{rider.name}</div>
                                                {selectedRider === rider.id && (
                                                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-400">{rider.team}</div>
                                            <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className={`flex items-center gap-1 ${getFormColor(rider.form)}`}>
                          <TrendingUp className="w-3 h-3" />
                          Forme: {getFormLabel(rider.form)}
                        </span>
                                                <span className="text-slate-500">•</span>
                                                <span className="text-slate-400">{rider.recent}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-slate-400 mb-1">Cote</div>
                                        <div className="text-2xl font-bold text-yellow-400">{rider.odds}</div>
                                        <div className="mt-2">
                                            <div className="text-xs text-slate-500 mb-1">{rider.popularity}% de popularité</div>
                                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-600"
                                                    style={{ width: `${rider.popularity}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Bonus */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            Utiliser un bonus (optionnel)
                        </h3>
                        <p className="text-sm text-slate-400">Maximise tes gains avec un bonus stratégique</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {bonuses.map((bonus) => {
                            const Icon = bonus.icon;
                            return (
                                <button
                                    key={bonus.id}
                                    onClick={() => setSelectedBonus(selectedBonus === bonus.id ? null : bonus.id)}
                                    disabled={!bonus.available}
                                    className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                                        selectedBonus === bonus.id
                                            ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                                            : bonus.available
                                                ? 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                                                : 'border-slate-800 bg-slate-900/30 opacity-50 cursor-not-allowed'
                                    }`}
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${bonus.color} rounded-xl flex items-center justify-center mb-3`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="font-bold mb-2 flex items-center justify-between">
                                        {bonus.name}
                                        {selectedBonus === bonus.id && (
                                            <CheckCircle className="w-5 h-5 text-yellow-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 mb-3">{bonus.description}</p>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {bonus.limit}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Récapitulatif et validation */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <h3 className="text-xl font-bold mb-4">Récapitulatif de ton pari</h3>

                    {selectedRider ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Coureur sélectionné</div>
                                    <div className="font-bold text-lg text-yellow-400">
                                        {riders.find(r => r.id === selectedRider)?.name}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {riders.find(r => r.id === selectedRider)?.team}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400 mb-1">Points potentiels</div>
                                    <div className="text-2xl font-bold text-green-400">
                                        {selectedBonus === 'bordure' ? '50-100 pts' : '50 pts'}
                                    </div>
                                </div>
                            </div>

                            {selectedBonus && (
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl">
                                    <Flame className="w-6 h-6 text-yellow-400" />
                                    <div>
                                        <div className="font-semibold text-yellow-400">
                                            {bonuses.find(b => b.id === selectedBonus)?.name} activé
                                        </div>
                                        <div className="text-sm text-slate-300">
                                            {bonuses.find(b => b.id === selectedBonus)?.description}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleBetSubmit}
                                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900 flex items-center justify-center gap-2"
                            >
                                Valider mon pari
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Sélectionne un coureur pour continuer</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Toast de confirmation */}
            {showConfirmation && (
                <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn z-50">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                        <div className="font-bold">Pari validé !</div>
                        <div className="text-sm opacity-90">Bonne chance pour la course 🚴</div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}