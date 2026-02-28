import api from '../lib/api';

export type RaceType = 'GRAND_TOUR' | 'MONUMENT' | 'STAGE_RACE' | 'CLASSIC' | 'CHAMPIONSHIP';

export type Race = {
    id: number;
    name: string;
    slug: string;
    type: RaceType;
    multiplicator: number;
    startDate: string;
    endDate: string;
    nationality: string;
    year: number;
};

export type PaginatedRaces = {
    data: Race[];
    meta: {
        total: number;
        perPage: number;
        currentPage: number;
        lastPage: number;
    };
};

export type Rider = {
    id: number;
    fullName: string;
    team: string;
    countryCode: string | null;
    $extras?: {
        pivot_bib?: number;
        pivot_team_name?: string;
    };
};

export type Startlist = {
    id: number;
    raceId: number;
    riders: Rider[];
};

export type Prediction = {
    id: number;
    userId: number;
    raceId: number;
    favoriteRiderId: number;
    bonusRiderId: number;
    pointsEarned: number | null;
    favoriteRider: Rider;
    bonusRider: Rider;
};

export type FantasyTeam = {
    id: number;
    userId: number;
    raceId: number;
    totalPoints: number | null;
    riders: Rider[];
};

export const raceService = {
    getRaces: async (year?: number): Promise<{ data: Race[] }> => {
        const params: Record<string, string | number> = {};
        if (year) params.year = year;
        const response = await api.get('/races', { params });
        return response.data;
    },
    importRace: async (slug: string): Promise<{ message: string, data: Race }> => {
        const response = await api.post(`/races/import/${slug}`);
        return response.data;
    },
    getStartlist: async (raceId: string | number): Promise<{ data: Startlist }> => {
        const response = await api.get(`/races/${raceId}/startlist`);
        return response.data;
    },
    getRaceById: async (raceId: string | number): Promise<{ data: Race }> => {
        const response = await api.get(`/races/${raceId}`);
        return response.data;
    },

    // Predictions (Classic Races)
    getPrediction: async (raceId: string | number): Promise<{ data: Prediction | null }> => {
        const response = await api.get(`/races/${raceId}/predictions/my`);
        return response.data;
    },
    submitPrediction: async (raceId: string | number, favoriteRiderId: number, bonusRiderId: number): Promise<{ message: string, data?: Prediction }> => {
        const response = await api.post(`/races/${raceId}/predictions`, {
            favoriteRiderId,
            bonusRiderId
        });
        return response.data;
    },
    updatePrediction: async (predictionId: number | string, favoriteRiderId: number, bonusRiderId: number): Promise<{ message: string, data: Prediction }> => {
        const response = await api.put(`/predictions/${predictionId}`, {
            favoriteRiderId,
            bonusRiderId
        });
        return response.data;
    },

    // Predictions (Fantasy Teams for Grand Tours)
    getFantasyTeam: async (raceId: string | number): Promise<{ data: FantasyTeam | null }> => {
        const response = await api.get(`/races/${raceId}/fantasy-teams/my`);
        return response.data;
    },
    submitFantasyTeam: async (raceId: string | number, riderIds: number[]): Promise<{ message: string, data?: FantasyTeam }> => {
        const response = await api.post(`/races/${raceId}/fantasy-teams`, {
            riderIds
        });
        return response.data;
    },
    updateFantasyTeam: async (teamId: number | string, riderIds: number[]): Promise<{ message: string, data: FantasyTeam }> => {
        const response = await api.put(`/fantasy-teams/${teamId}`, {
            riderIds
        });
        return response.data;
    }
};
