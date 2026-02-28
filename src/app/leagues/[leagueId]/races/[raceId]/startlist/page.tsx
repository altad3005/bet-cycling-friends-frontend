"use client";

import React, { useState, useEffect, use } from 'react';
import { Users, AlertCircle, Loader2, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { raceService, type Rider } from '@/services/race.service';

export default function StartlistPage({ params }: { params: Promise<{ leagueId: string, raceId: string }> }) {
    const { leagueId, raceId } = use(params);

    const [riders, setRiders] = useState<Rider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        raceService.getStartlist(raceId)
            .then((res) => {
                setRiders(res.data.riders || []);
            })
            .catch(() => {
                setError('Impossible de charger la startlist. Veuillez réessayer.');
            })
            .finally(() => setIsLoading(false));
    }, [raceId]);

    // Format riders by team
    const teams = riders.reduce((acc, rider) => {
        const teamName = rider.team || rider.$extras?.pivot_team_name || 'Équipe inconnue';
        if (!acc[teamName]) {
            acc[teamName] = [];
        }
        acc[teamName].push(rider);
        return acc;
    }, {} as Record<string, Rider[]>);

    // Sort riders within teams by Bib number if available
    Object.values(teams).forEach(teamRiders => {
        teamRiders.sort((a, b) => {
            const bibA = a.$extras?.pivot_bib || 999;
            const bibB = b.$extras?.pivot_bib || 999;
            return bibA - bibB;
        });
    });

    const filteredTeams = Object.entries(teams).map(([teamName, teamRiders]) => {
        const filteredRiders = teamRiders.filter(r =>
            r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.countryCode?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { teamName, riders: filteredRiders };
    }).filter(team => team.riders.length > 0);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link
                    href={`/leagues/${leagueId}/races/${raceId}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-max"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la course
                </Link>

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">Startlist</h2>
                        <p className="text-slate-400">
                            {riders.length} coureurs {Object.keys(teams).length ? `• ${Object.keys(teams).length} équipes` : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un coureur ou une équipe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
            </div>

            {/* Content */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTeams.length === 0 ? (
                        <div className="md:col-span-2 text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg">Aucun coureur trouvé</p>
                        </div>
                    ) : (
                        filteredTeams.map(({ teamName, riders }) => (
                            <div key={teamName} className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
                                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50">
                                    <h3 className="font-bold text-lg text-white">{teamName}</h3>
                                </div>
                                <div className="divide-y divide-slate-800/50">
                                    {riders.map(rider => (
                                        <div key={rider.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 font-mono text-sm text-slate-500">
                                                    {rider.$extras?.pivot_bib || '-'}
                                                </div>
                                                {rider.countryCode && (
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${rider.countryCode.toLowerCase()}.png`}
                                                        alt={rider.countryCode}
                                                        className="w-6 h-4 object-cover rounded-sm"
                                                    />
                                                )}
                                                <span className="font-medium text-slate-200">{rider.fullName}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
