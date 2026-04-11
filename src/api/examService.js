import apiClient from './apiClient';

export const getCourseExam = async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/exam`);
    return response.data;
};

export const getExamHistory = async () => {
    const response = await apiClient.get(`/user/exams/history`);
    return response.data;
};

export const submitExam = async (courseId, examData) => {
    const response = await apiClient.post(`/courses/${courseId}/exam/submit`, examData);
    return response.data;
};
