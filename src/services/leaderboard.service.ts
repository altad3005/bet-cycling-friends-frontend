import api from '../lib/api';

export type LeaderboardEntry = {
    id: number;
    pseudo: string;
    icone: string | null;
    total_score: number;
};

export const leaderboardService = {
    getLeagueLeaderboard: async (leagueId: string | number): Promise<{ data: LeaderboardEntry[] }> => {
        const response = await api.get(`/leaderboard/leagues/leaderboard/${leagueId}`);
        return response.data;
    },
    getGlobalLeaderboard: async (): Promise<{ data: LeaderboardEntry[] }> => {
        const response = await api.get(`/leaderboard`);
        return response.data;
    },
    getGlobalStats: async (): Promise<{ data: any }> => {
        const response = await api.get('/stats');
        return response.data;
    }
};
