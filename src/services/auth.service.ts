import api from '../lib/api';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        console.log(response.data);
        return response.data;
    },

    register: async (data: Record<string, string>) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};
