"use client";

import React, { useState } from 'react';
import { Home, Calendar, BarChart3, Info, Users } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ParticipantsPanel from '@/components/league/layout/ParticipantsPanel';

type Participant = {
    name: string;
    avatar: string;
    isAdmin: boolean;
};

type HeaderProps = {
    title: string;
    subtitle: string;
    participants: Participant[];
};

export default function Header({ title, subtitle, participants }: HeaderProps) {
    const [isParticipantsPanelOpen, setIsParticipantsPanelOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: '/league', icon: Home, label: 'Home' },
        { href: '/league/courses', icon: Calendar, label: 'Courses' },
        { href: '/league/stats', icon: BarChart3, label: 'Stats' },
        { href: '/league/info', icon: Info, label: 'Infos ligue' },
        { href: '/league/admin', icon: Users, label: 'Admin' },
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
                            <Image
                                src="/bcf_logo.svg"
                                alt="Logo BetCyclingFriends"
                                width={40}
                                height={40}
                            />
                            <div>
                                <h1 className="text-lg font-bold">{title}</h1>
                                <p className="text-xs text-slate-400">{subtitle}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsParticipantsPanelOpen(true)}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Users className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href} passHref>
                                    <button
                                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                                            isActive
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>
        </>
    );
}
