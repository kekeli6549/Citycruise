import apiClient from './apiClient';

export const getAllCourses = async () => {
    const response = await apiClient.get('/courses');
    return response.data;
};

export const getCourseById = async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
};

export const getMyCourses = async () => {
    const response = await apiClient.get('/my-courses');
    return response.data;
};

export const GetCourseLessons = async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/lessons`);
    return response.data;
};

export const getLessonDetails = async (id) => {
    const response = await apiClient.get(`/lessons/${id}`);
    return response.data;
};

export const markLessonComplete = async (id) => {
    const response = await apiClient.post(`/lessons/${id}/complete`);
    return response.data;
};