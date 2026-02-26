"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/league/layout/Header';
import { leagueService } from '@/services/league.service';

type Member = {
    id: number;
    role: string;
    user: {
        id: number;
        pseudo: string;
    };
};

type League = {
    id: number;
    name: string;
    description?: string;
};

export default function LeagueLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ leagueId: string }>;
}) {
    const [leagueId, setLeagueId] = useState<string>('');
    const [league, setLeague] = useState<League | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        params.then((resolved) => {
            const id = resolved.leagueId;
            setLeagueId(id);
            Promise.all([
                leagueService.getLeagueDetails(id),
                leagueService.getLeagueMembers(id),
            ])
                .then(([leagueData, membersData]) => {
                    setLeague(leagueData.data);
                    setMembers(membersData.data || []);
                })
                .catch(() => {
                    // Errors are non-fatal for the layout; pages handle their own errors
                })
                .finally(() => setLoading(false));
        });
    }, [params]);

    // Map API members to the shape expected by <Header /> and <ParticipantsPanel />
    const participants = members.map((m) => ({
        name: m.user?.pseudo || 'Utilisateur',
        avatar: m.user?.pseudo?.[0]?.toUpperCase() || '?',
        isAdmin: m.role === 'admin',
    }));

    const title = loading ? '...' : league?.name ?? `Ligue ${leagueId}`;
    const subtitle = loading ? '' : `${participants.length} membre${participants.length !== 1 ? 's' : ''}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            <Header
                leagueId={leagueId}
                title={title}
                subtitle={subtitle}
                participants={participants}
            />
            <main>{children}</main>
        </div>
    );
}
