import React, { use } from 'react';
import Header from '@/components/league/layout/Header';

export default function LeagueLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ leagueId: string }>;
}) {
    const resolvedParams = use(params);
    const leagueId = resolvedParams.leagueId;

    // These would typically come from a data source or API based on leagueId
    const leagueName = `League ${leagueId}`;
    const participants = [
        { name: 'MaxPower', avatar: '🚴', isAdmin: true },
        { name: 'CyclingQueen', avatar: '👑', isAdmin: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            <Header
                leagueId={leagueId}
                title={leagueName}
                subtitle={`${participants.length} membres`}
                participants={participants}
            />
            <main>{children}</main>
        </div>
    );
}
