import apiClient from './apiClient';

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};