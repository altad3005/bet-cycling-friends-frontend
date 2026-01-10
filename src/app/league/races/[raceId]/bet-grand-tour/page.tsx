"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Mountain, Search, CheckCircle, Users, Edit, Shield } from 'lucide-react';

const MAX_TEAM_SIZE = 8;

export default function BetGrandTourPage() {
    const [selectedTeam, setSelectedTeam] = useState<number[]>([]);
    const [isBetConfirmed, setIsBetConfirmed] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const race = {
        name: "Tour de France",
        date: "Du 5 au 27 juillet 2025",
        country: "France",
        stages: 21,
        category: "Grand Tour",
    };

    const allRiders = [
        { id: 1, name: "Tadej Pogačar", team: "UAE Team Emirates", country: "🇸🇮" },
        { id: 2, name: "Jonas Vingegaard", team: "Visma-Lease a Bike", country: "🇩🇰" },
        { id: 3, name: "Remco Evenepoel", team: "Soudal Quick-Step", country: "🇧🇪" },
        { id: 4, name: "Primož Roglič", team: "Red Bull-BORA-hansgrohe", country: "🇸🇮" },
        { id: 5, name: "Mathieu van der Poel", team: "Alpecin-Deceuninck", country: "🇳🇱" },
        { id: 6, name: "Wout van Aert", team: "Visma-Lease a Bike", country: "🇧🇪" },
        { id: 7, name: "Jasper Philipsen", team: "Alpecin-Deceuninck", country: "🇧🇪" },
        { id: 8, name: "Mads Pedersen", team: "Lidl-Trek", country: "🇩🇰" },
        { id: 9, name: "Adam Yates", team: "UAE Team Emirates", country: "🇬🇧" },
        { id: 10, name: "Carlos Rodríguez", team: "INEOS Grenadiers", country: "🇪🇸" },
        { id: 11, name: "Jai Hindley", team: "Red Bull-BORA-hansgrohe", country: "🇦🇺" },
        { id: 12, name: "Enric Mas", team: "Movistar Team", country: "🇪🇸" },
        { id: 13, name: "Stefan Küng", team: "Groupama-FDJ", country: "🇨🇭" },
        { id: 14, name: "Jonas Vingegaard", team: "Visma-Lease a Bike", country: "🇩🇰" },
        { id: 15, name: "Julian Alaphilippe", team: "Soudal Quick-Step", country: "🇫🇷" }
    ];

    const filteredRiders = useMemo(() => {
        if (!searchTerm) return allRiders;
        return allRiders.filter(rider =>
            rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rider.team.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allRiders]);

    const handleRiderSelect = (riderId: number) => {
        if (isBetConfirmed) return;

        setSelectedTeam(prevTeam => {
            if (prevTeam.includes(riderId)) {
                return prevTeam.filter(id => id !== riderId);
            }
            if (prevTeam.length < MAX_TEAM_SIZE) {
                return [...prevTeam, riderId];
            }
            return prevTeam; // Team is full, do not add
        });
    };

    const handleBetSubmit = () => {
        if (selectedTeam.length === MAX_TEAM_SIZE) {
            setIsBetConfirmed(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Race Info */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 border border-purple-500/30 p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{race.name}</h2>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">{race.category}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{race.date}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{race.country}</span>
                                <span className="flex items-center gap-1.5"><Mountain className="w-4 h-4" />{race.stages} étapes</span>
                            </div>
                        </div>
                    </div>
                </section>

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
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isBetConfirmed}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
                        {filteredRiders.map((rider) => {
                            const isSelected = selectedTeam.includes(rider.id);
                            return (
                                <button
                                    key={rider.id}
                                    onClick={() => handleRiderSelect(rider.id)}
                                    disabled={isBetConfirmed}
                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                        isSelected ? 'bg-yellow-500/20 border-yellow-500' : 'bg-slate-800/50 border-slate-700'
                                    } ${isBetConfirmed ? 'cursor-not-allowed opacity-70' : 'hover:border-slate-600'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-yellow-400 border-yellow-300' : 'border-slate-600'}`}>
                                        {isSelected && <CheckCircle className="w-4 h-4 text-slate-900" />}
                                    </div>
                                    <div className="font-semibold">{rider.name}</div>
                                    <div className="text-sm text-slate-400 ml-auto">{rider.team}</div>
                                </button>
                            );
                        })}
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
                            <button
                                onClick={() => setIsBetConfirmed(false)}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                Modifier mon équipe
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleBetSubmit}
                            disabled={selectedTeam.length !== MAX_TEAM_SIZE}
                            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:from-yellow-600 enabled:hover:to-amber-700 enabled:transform enabled:hover:scale-105"
                        >
                            <Shield className="w-5 h-5" />
                            Valider mon équipe ({selectedTeam.length}/{MAX_TEAM_SIZE})
                        </button>
                    )}
                </section>
            </div>
        </div>
    );
}
