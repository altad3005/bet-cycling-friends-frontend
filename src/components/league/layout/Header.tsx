"use client";

import React, { useState } from 'react';
import { Home, Calendar, BarChart3, Info, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ParticipantsPanel from '@/components/league/layout/ParticipantsPanel';
import { useLeague } from '@/contexts/LeagueContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header({ leagueId }: { leagueId: string }) {
    const { league, members, isLoading } = useLeague();
    const { user } = useAuth();
    const [isParticipantsPanelOpen, setIsParticipantsPanelOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const pathname = usePathname();

    const participants = members.map((m) => ({
        name: m.user?.pseudo || 'Utilisateur',
        avatar: m.user?.pseudo?.[0]?.toUpperCase() || '?',
        isAdmin: m.role === 'admin',
    }));

    const title = isLoading ? '...' : league?.name ?? `Ligue ${leagueId}`;
    const subtitle = isLoading ? '' : `${participants.length} membre${participants.length !== 1 ? 's' : ''}`;
    const inviteCode = league?.inviteCode;

    const handleCopyCode = () => {
        if (!inviteCode) return;
        navigator.clipboard.writeText(`${leagueId}:${inviteCode}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isCurrentUserAdmin = members.some(m => m.user.id === user?.id && m.role?.toUpperCase() === 'ADMIN');

    const navItems = [
        { href: `/leagues/${leagueId}`, icon: Home, label: 'Home' },
        { href: `/leagues/${leagueId}/races`, icon: Calendar, label: 'Races' },
        { href: `/leagues/${leagueId}/stats`, icon: BarChart3, label: 'Stats' },
        { href: `/leagues/${leagueId}/info`, icon: Info, label: 'Infos ligue' },
        ...(isCurrentUserAdmin ? [{ href: `/leagues/${leagueId}/admin`, icon: Users, label: 'Admin' }] : []),
    ];

    return (
        <>
            <ParticipantsPanel
                isOpen={isParticipantsPanelOpen}
                onClose={() => setIsParticipantsPanelOpen(false)}
                participants={participants}
            />

            <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-[64px] z-30">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center justify-between w-full md:w-auto overflow-hidden">
                            <div className="min-w-0 pr-4">
                                <h1 className="text-xl font-bold flex items-center gap-2 truncate">
                                    <span className="truncate">{title}</span>
                                    {inviteCode && (
                                        <button
                                            onClick={handleCopyCode}
                                            className="ml-2 px-2 py-0.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-xs font-mono rounded border border-yellow-500/30 transition-colors flex-shrink-0 flex items-center gap-1"
                                            title="Copier le code d'invitation"
                                        >
                                            {copied ? 'Copié !' : `Code: ${leagueId}:${inviteCode}`}
                                        </button>
                                    )}
                                </h1>
                                <p className="text-sm text-slate-400 mt-0.5 truncate">{subtitle}</p>
                            </div>
                            <button
                                onClick={() => setIsParticipantsPanelOpen(true)}
                                className="md:hidden flex-shrink-0 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-300 border border-slate-700 hover:border-slate-500"
                            >
                                <Users className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                            <nav className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-hide">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${isActive
                                                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                                : 'text-slate-300 hover:bg-slate-800'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <button
                                onClick={() => setIsParticipantsPanelOpen(true)}
                                className="hidden md:flex flex-shrink-0 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors items-center gap-2 text-sm text-slate-300 border border-slate-700 hover:border-slate-500"
                            >
                                <Users className="w-4 h-4" />
                                Membres
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
