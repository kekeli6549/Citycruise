import apiClient from './apiClient';

export const registerUser = async (userData) => {
    const payload = {
        email: userData.email,
        username: `${userData.firstName} ${" "} ${userData.lastName}`,
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


export const getProfile = async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
};