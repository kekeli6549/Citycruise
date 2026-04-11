import apiClient from './apiClient';

export const initializePayment = async (courseId) => {
    const response = await apiClient.post('/payments/initialize', { courseId });
    return response.data;
};
