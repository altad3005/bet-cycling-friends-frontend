"use client";

import React, { useState, useMemo } from 'react';
import { Trophy, Calendar, MapPin, Mountain, Star, Search, CheckCircle, Edit, Shield } from 'lucide-react';

export default function BetPage() {
    const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
    const [selectedBonusRider, setSelectedBonusRider] = useState<number | null>(null);
    const [isBetConfirmed, setIsBetConfirmed] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const race = {
        name: "Paris-Roubaix",
        date: "Dimanche 13 avril 2025",
        time: "10:30",
        country: "France",
        distance: "257 km",
        category: "Monument",
    };

    const allRiders = [
        { id: 1, name: "Mathieu van der Poel", team: "Alpecin-Deceuninck", country: "🇳🇱"},
        { id: 2, name: "Wout van Aert", team: "Visma-Lease a Bike", country: "🇧🇪" },
        { id: 3, name: "Filippo Ganna", team: "INEOS Grenadiers", country: "🇮🇹" },
        { id: 4, name: "Jasper Philipsen", team: "Alpecin-Deceuninck", country: "🇧🇪"},
        { id: 5, name: "Mads Pedersen", team: "Lidl-Trek", country: "🇩🇰" },
        { id: 6, name: "Stefan Küng", team: "Groupama-FDJ", country: "🇨🇭" },
        { id: 7, name: "Christophe Laporte", team: "Visma-Lease a Bike", country: "🇫🇷"},
        { id: 8, name: "Nils Politt", team: "UAE Team Emirates", country: "🇩🇪" },
        { id: 9, name: "Tadej Pogačar", team: "UAE Team Emirates", country: "🇸🇮" },
        { id: 10, name: "Remco Evenepoel", team: "Soudal Quick-Step", country: "🇧🇪" },
        { id: 11, name: "Jonas Vingegaard", team: "Visma-Lease a Bike", country: "🇩🇰" },
        { id: 12, name: "Julian Alaphilippe", team: "Soudal Quick-Step", country: "🇫🇷" },
    ];

    const filteredRiders = useMemo(() => {
        if (!searchTerm) return allRiders;
        return allRiders.filter(rider =>
            rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rider.team.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allRiders]);

    const handleRiderClick = (riderId: number) => {
        if (isBetConfirmed) return; // Do not allow changes if bet is confirmed

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

    const handleBetSubmit = () => {
        if (selectedWinner && selectedBonusRider) {
            setIsBetConfirmed(true);
        }
    };

    const getSelectionTitle = () => {
        if (!selectedWinner) return "Étape 1/2 : Choisis ton Vainqueur";
        if (!selectedBonusRider) return "Étape 2/2 : Choisis ton Coureur Bonus";
        return "Tes choix sont faits !";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Race Info */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border border-yellow-500/30 p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{race.name}</h2>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">{race.category}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{race.date} • {race.time}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{race.country}</span>
                                <span className="flex items-center gap-1.5"><Mountain className="w-4 h-4" />{race.distance}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Unified Rider Selection */}
                <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-400" />
                            {isBetConfirmed ? "Pari Verrouillé" : getSelectionTitle()}
                        </h3>
                        <div className="text-sm text-slate-400">{allRiders.length} coureurs inscrits</div>
                    </div>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un coureur..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isBetConfirmed}
                        />
                    </div>
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                        {filteredRiders.map((rider) => {
                            const isWinner = selectedWinner === rider.id;
                            const isBonus = selectedBonusRider === rider.id;
                            return (
                                <button
                                    key={rider.id}
                                    onClick={() => handleRiderClick(rider.id)}
                                    disabled={isBetConfirmed}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                        isWinner ? 'bg-yellow-500/20 border-yellow-500' :
                                        isBonus ? 'bg-purple-500/20 border-purple-500' :
                                        'bg-slate-800/50 border-slate-700'
                                    } ${isBetConfirmed ? 'cursor-not-allowed opacity-70' : 'hover:border-slate-600'}`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900">
                                                {rider.country}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-lg">{rider.name}</div>
                                                <div className="text-sm text-slate-400">{rider.team}</div>
                                            </div>
                                        </div>
                                        {isWinner && (
                                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30 flex items-center gap-1.5">
                                                <Trophy className="w-4 h-4" /> Vainqueur
                                            </span>
                                        )}
                                        {isBonus && (
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30 flex items-center gap-1.5">
                                                <Star className="w-4 h-4" /> Bonus
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
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
                                <div className="font-bold text-lg text-yellow-400">{allRiders.find(r => r.id === selectedWinner)?.name}</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl">
                                <div className="text-sm text-slate-400 mb-1 flex items-center gap-1.5"><Star className="w-4 h-4 text-purple-400" /> Coureur Bonus</div>
                                <div className="font-bold text-lg text-purple-400">{allRiders.find(r => r.id === selectedBonusRider)?.name}</div>
                            </div>
                            <button
                                onClick={() => setIsBetConfirmed(false)}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                Modifier mon pari
                            </button>
                        </div>
                    ) : (
                        (selectedWinner && selectedBonusRider) ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-800/50 rounded-xl">
                                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-400" /> Vainqueur</div>
                                    <div className="font-bold text-lg text-yellow-400">{allRiders.find(r => r.id === selectedWinner)?.name}</div>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-xl">
                                    <div className="text-sm text-slate-400 mb-1 flex items-center gap-1.5"><Star className="w-4 h-4 text-purple-400" /> Coureur Bonus</div>
                                    <div className="font-bold text-lg text-purple-400">{allRiders.find(r => r.id === selectedBonusRider)?.name}</div>
                                </div>
                                <button
                                    onClick={handleBetSubmit}
                                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50 text-slate-900 flex items-center justify-center gap-2"
                                >
                                    <Shield className="w-5 h-5" />
                                    Valider et verrouiller mon pari
                                </button>
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