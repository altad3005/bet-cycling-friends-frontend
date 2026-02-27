"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/league/layout/Header';
import { LeagueProvider } from '@/contexts/LeagueContext';

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

    useEffect(() => {
        params.then((resolved) => {
            setLeagueId(resolved.leagueId);
        });
    }, [params]);

    if (!leagueId) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <LeagueProvider leagueId={leagueId}>
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
                <Header leagueId={leagueId} />
                <main className="flex-grow">{children}</main>
            </div>
        </LeagueProvider>
    );
}
