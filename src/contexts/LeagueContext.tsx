"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { leagueService } from '@/services/league.service';

type User = {
    id: number;
    pseudo: string;
    avatarUrl: string | null;
};

type Member = {
    id: number;
    role: string;
    user: User;
};

type League = {
    id: number;
    name: string;
    description?: string;
    inviteCode?: string;
};

type LeagueContextType = {
    league: League | null;
    members: Member[];
    isLoading: boolean;
    error: string | null;
    refreshLeague: () => Promise<void>;
};

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export function LeagueProvider({ children, leagueId }: { children: ReactNode; leagueId: string }) {
    const [league, setLeague] = useState<League | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeagueData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [leagueRes, membersRes] = await Promise.all([
                leagueService.getLeagueDetails(leagueId),
                leagueService.getLeagueMembers(leagueId),
            ]);
            setLeague(leagueRes.data);
            setMembers(membersRes.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors du chargement de la ligue');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (leagueId) {
            fetchLeagueData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leagueId]);

    const value = {
        league,
        members,
        isLoading,
        error,
        refreshLeague: fetchLeagueData,
    };

    return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
}

export function useLeague() {
    const context = useContext(LeagueContext);
    if (context === undefined) {
        throw new Error('useLeague must be used within a LeagueProvider');
    }
    return context;
}
