import api from '../lib/api';

export const leagueService = {
    // Get leagues the authenticated user belongs to
    getUserLeagues: async () => {
        const response = await api.get('/users/leagues');
        return response.data; // { message, data: LeagueMember[] with preloaded league }
    },

    // Get details of a specific league
    getLeagueDetails: async (leagueId: string | number) => {
        const response = await api.get(`/leagues/${leagueId}`);
        return response.data; // { message, data: League }
    },

    // Get all members of a league with their user info
    getLeagueMembers: async (leagueId: string | number) => {
        const response = await api.get(`/leagues/${leagueId}/members`);
        return response.data; // { message, data: LeagueMember[] with preloaded user }
    },

    // Create a new league (creator is automatically set as admin by backend)
    createLeague: async (name: string, description?: string) => {
        const response = await api.post('/leagues', { name, description });
        return response.data; // { message, data: League }
    },

    // Join a league by invite code
    joinLeague: async (leagueId: number, inviteCode: string) => {
        const response = await api.post('/leagues/join', { leagueId, inviteCode });
        return response.data;
    },
}
