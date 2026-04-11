import apiClient from './apiClient';

export const registerUser = async (userData) => {
    const payload = {
        email: userData.email,
        username: `${userData.firstName} ${userData.lastName}`,
        password: userData.password
    };

    const response = await apiClient.post('/auth/register', payload);
    return response.data;
};

export const updateUserInfo = async (userData) => {
    const payload = {
        email: userData.email,
        username: userData.username,
        password: userData.password
    };

    const response = await apiClient.post('/auth/update', payload);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};

export const logoutUser = async () => {
    await apiClient.post('/auth/logout');
};

export const getProfile = async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
};

// --- NEW PASSWORD RESET API CALLS ---

export const forgotPassword = async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    return response.data;
};