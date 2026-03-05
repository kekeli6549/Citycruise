import apiClient from './apiClient';

export const getAllCourses = async () => {
    const response = await apiClient.get('/courses');
    return Array.isArray(response.data) ? response.data : response.data.data;
};