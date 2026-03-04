"use client";

import React, { useState } from 'react';
import { Info, Users, Copy, CheckCircle } from 'lucide-react';
import { useLeague } from '@/contexts/LeagueContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function LeagueInfoPage({ params }: { params: Promise<{ leagueId: string }> }) {
    const { league, members, isLoading } = useLeague();
    const [copied, setCopied] = useState(false);

    if (isLoading) {
        return <LoadingSpinner size="section" />;
    }

    const { leagueId } = React.use(params);

    const handleCopyToken = () => {
        if (!league?.inviteCode) return;
        navigator.clipboard.writeText(`${leagueId}:${league.inviteCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20">
            <h2 className="text-3xl font-bold flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                    <Info className="w-6 h-6 text-yellow-400" />
                </div>
                Informations de la ligue
            </h2>

            {league ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                        <h3 className="text-xl font-bold pb-2 border-b border-slate-800">Détails</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500">Nom de la ligue</p>
                                <p className="font-medium text-lg text-white">{league.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Code d'invitation</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <code className="bg-slate-800 px-3 py-1.5 rounded-lg text-yellow-400 font-mono flex-1 border border-slate-700">
                                        {leagueId}:{league.inviteCode}
                                    </code>
                                    <button
                                        onClick={handleCopyToken}
                                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                                        title="Copier le code"
                                    >
                                        {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                        <h3 className="text-xl font-bold pb-2 border-b border-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-slate-400" />
                            Membres ({members.length})
                        </h3>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {members.map(member => (
                                <div key={member.id} className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
                                    <span className="font-medium text-slate-200">{member.user?.pseudo}</span>
                                    {member.role === 'admin' && (
                                        <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20">Admin</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={Info}
                    title="Ligue introuvable"
                    className="bg-slate-900/50 rounded-2xl border border-slate-800 py-20"
                />
            )}
        </div>
    );
}
