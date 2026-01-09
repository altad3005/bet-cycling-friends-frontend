import React from 'react';
import Header from '@/components/league/layout/Header';

export default function LeagueLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // These would typically come from a data source or API
    const leagueName = "Les Grimpeurs Fous";
    const participants = [
        { name: 'MaxPower', avatar: '🚴', isAdmin: true },
        { name: 'CyclingQueen', avatar: '👑', isAdmin: false },
        { name: 'VeloMaster', avatar: '⚡', isAdmin: false },
        { name: 'SprintGod', avatar: '🚀', isAdmin: false },
        { name: 'ClimberKing', avatar: '🏔️', isAdmin: false },
        { name: 'RouleurRider', avatar: '🚂', isAdmin: false },
        { name: 'PuncheurPro', avatar: '🥊', isAdmin: false },
        { name: 'TimeTrialTitan', avatar: '⏱️', isAdmin: false },
        { name: 'DomestiqueDeluxe', avatar: '🤝', isAdmin: false },
        { name: 'LanternRouge', avatar: '🏮', isAdmin: false },
        { name: 'PelotonPatroller', avatar: '👮', isAdmin: false },
        { name: 'BreakawayArtist', avatar: '🎨', isAdmin: false },
        { name: 'GrimpeurAgile', avatar: '🤸', isAdmin: false },
        { name: 'Flatlander', avatar: '💨', isAdmin: false },
        { name: 'CobblestoneCrusher', avatar: '🧱', isAdmin: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            <Header
                title={leagueName}
                subtitle={`${participants.length} membres`}
                participants={participants}
            />
            <main>{children}</main>
        </div>
    );
}
