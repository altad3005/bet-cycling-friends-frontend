"use client";

import React, { useState, useEffect, use } from 'react';
import { Users, AlertCircle, Loader2, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { raceService, type Rider } from '@/services/race.service';
import BackLink from '@/components/ui/BackLink';
import SearchInput from '@/components/ui/SearchInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorAlert from '@/components/ui/ErrorAlert';
import EmptyState from '@/components/ui/EmptyState';

export default function StartlistPage({ params }: { params: Promise<{ leagueId: string, raceId: string }> }) {
    const { leagueId, raceId } = use(params);

    const [riders, setRiders] = useState<Rider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStartlist = () => {
        setIsLoading(true);
        raceService.getStartlist(raceId)
            .then((res) => {
                const uniqueRiders = Array.from(new Map((res.data.riders || []).map(r => [r.id, r])).values());
                setRiders(uniqueRiders as Rider[]);
                setError(null);
            })
            .catch(() => {
                setError('Impossible de charger la startlist. Veuillez réessayer.');
            })
            .finally(() => setIsLoading(false));
    };

    const handleSync = () => {
        setIsSyncing(true);
        raceService.syncStartlist(raceId)
            .then((res) => {
                const uniqueRiders = Array.from(new Map((res.data.riders || []).map(r => [r.id, r])).values());
                setRiders(uniqueRiders as Rider[]);
                setError(null);
            })
            .catch(() => {
                setError('Échec de la synchronisation de la startlist.');
            })
            .finally(() => setIsSyncing(false));
    };

    useEffect(() => {
        fetchStartlist();
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
                <BackLink href={`/leagues/${leagueId}/races/${raceId}`} label="Retour à la course" />

                <div className="flex items-center justify-between">
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

                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Synchronisation...' : 'Forcer l\'actualisation'}
                    </button>
                </div>
            </div>

            {/* Search */}
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un coureur ou une équipe..."
            />

            {/* Content */}
            {isLoading && <LoadingSpinner size="section" />}

            {error && <ErrorAlert message={error} className="mb-4" />}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredTeams.length === 0 ? (
                        <div className="md:col-span-2">
                            <EmptyState
                                icon={Users}
                                title="Aucun coureur trouvé"
                                className="bg-slate-900/50 rounded-2xl border border-slate-800"
                            />
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
