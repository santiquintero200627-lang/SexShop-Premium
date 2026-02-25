import apiClient from './apiClient';
import { jwtDecode } from 'jwt-decode';

const authService = {
    login: async (email, password) => {
        const response = await apiClient.post('/api/Auth/login', { email, password });
        if (response.data.succeeded) {
            const userData = response.data.data;
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        }
        throw new Error(response.data.message || 'Error al iniciar sesión');
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAdmin: () => {
        const user = authService.getCurrentUser();
        if (!user) return false;

        // Handle different casing from API
        const roles = user.roles || user.Roles || [];
        return roles.some(role => role.toLowerCase() === 'admin');
    }
};

export default authService;
