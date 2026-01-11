"use client";

import React, { useState } from 'react';
import { Home, Calendar, BarChart3, Info, Users } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ParticipantsPanel from '@/components/league/layout/ParticipantsPanel';
import UserProfileMenu from '@/components/layout/UserProfileMenu';

type Participant = {
    name: string;
    avatar: string;
    isAdmin: boolean;
};

type HeaderProps = {
    leagueId: string;
    title: string;
    subtitle: string;
    participants: Participant[];
};

export default function Header({ leagueId, title, subtitle, participants }: HeaderProps) {
    const [isParticipantsPanelOpen, setIsParticipantsPanelOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: `/leagues/${leagueId}`, icon: Home, label: 'Home' },
        { href: `/leagues/${leagueId}/races`, icon: Calendar, label: 'Races' },
        { href: `/leagues/${leagueId}/stats`, icon: BarChart3, label: 'Stats' },
        { href: `/leagues/${leagueId}/info`, icon: Info, label: 'Infos ligue' },
        { href: `/leagues/${leagueId}/admin`, icon: Users, label: 'Admin' },
    ];

    return (
        <>
            <ParticipantsPanel
                isOpen={isParticipantsPanelOpen}
                onClose={() => setIsParticipantsPanelOpen(false)}
                participants={participants}
            />

            <header className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link href="/leagues">
                                <Image
                                    src="/bcf_logo.svg"
                                    alt="Logo BetCyclingFriends"
                                    width={40}
                                    height={40}
                                    className="cursor-pointer"
                                />
                            </Link>
                            <div>
                                <h1 className="text-lg font-bold">{title}</h1>
                                <p className="text-xs text-slate-400">{subtitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsParticipantsPanelOpen(true)}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Users className="w-5 h-5 text-slate-400" />
                            </button>
                            <div className="border-l border-slate-800 ml-2 pl-2">
                                <UserProfileMenu />
                            </div>
                        </div>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                                        isActive
                                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>
        </>
    );
}
