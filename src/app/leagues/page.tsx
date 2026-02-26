"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Users, ArrowRight, Star, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { leagueService } from '@/services/league.service';
import { useAuth } from '@/contexts/AuthContext';

type League = {
    id: number;
    name: string;
    description?: string;
    creatorId: number;
};

type LeagueMembership = {
    id: number;
    role: string;
    league: League;
};

export default function LeaguesPage() {
    const [memberships, setMemberships] = useState<LeagueMembership[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinError, setJoinError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const data = await leagueService.getUserLeagues();
                setMemberships(data.data || []);
            } catch (err: any) {
                setError('Impossible de charger vos ligues. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };
        fetchLeagues();
    }, []);

    const handleJoin = async () => {
        if (!joinCode.trim()) return;
        setJoinError('');
        setJoinLoading(true);
        try {
            // The join API needs both leagueId and inviteCode.
            // For now we parse a "leagueId:code" format from the input.
            // e.g. "3:abc12345"
            const [leagueIdStr, ...codeParts] = joinCode.split(':');
            const code = codeParts.join(':');
            if (!leagueIdStr || !code) {
                setJoinError('Format: <ID>:<code> — ex: 3:abc12345');
                setJoinLoading(false);
                return;
            }
            await leagueService.joinLeague(Number(leagueIdStr), code);
            // Refresh list
            const data = await leagueService.getUserLeagues();
            setMemberships(data.data || []);
            setJoinCode('');
        } catch (err: any) {
            setJoinError(err.response?.data?.message || 'Code invalide ou ligue introuvable.');
        } finally {
            setJoinLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        Mes Ligues
                    </h1>
                    <p className="text-slate-400 mt-2">Rejoins une ligue ou crées-en une pour commencer à parier !</p>
                </div>
                <Link href="/leagues/create">
                    <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105">
                        <Plus className="w-5 h-5" />
                        Créer une ligue
                    </button>
                </Link>
            </div>

            {/* Join League Section */}
            <section className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-2xl font-bold mb-4">Rejoindre une ligue</h2>
                <p className="text-sm text-slate-500 mb-3">Format du code : <code className="bg-slate-800 px-1 rounded">ID:code</code> — ex: <code className="bg-slate-800 px-1 rounded">3:abc12345</code></p>
                {joinError && (
                    <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {joinError}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        placeholder="Entre le code de la ligue..."
                        className="flex-grow px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                        onClick={handleJoin}
                        disabled={joinLoading || !joinCode.trim()}
                        className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {joinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rejoindre'}
                    </button>
                </div>
            </section>

            {/* League List */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Tes ligues actuelles</h2>

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {!loading && !error && memberships.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Tu n&apos;as pas encore de ligue.</p>
                        <p className="text-sm mt-1">Crée ta première ligue ou rejoins-en une !</p>
                    </div>
                )}

                {!loading && memberships.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memberships.map((membership) => (
                            <Link key={membership.id} href={`/leagues/${membership.league.id}`} className="block group">
                                <div className="h-full bg-slate-900/50 rounded-2xl border border-slate-800 group-hover:border-yellow-500/50 transition-all p-6 flex flex-col justify-between">
                                    <div>
                                        {membership.role === 'admin' && (
                                            <div className="text-xs text-yellow-400 flex items-center gap-1 mb-2">
                                                <Star className="w-4 h-4 fill-yellow-400" /> Admin
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">
                                            {membership.league.name}
                                        </h3>
                                        {membership.league.description && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                {membership.league.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-6 flex items-center justify-end pt-4 border-t border-slate-800">
                                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
