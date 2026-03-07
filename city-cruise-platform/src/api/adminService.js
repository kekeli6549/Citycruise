import apiClient from './apiClient';

// Courses
export const adminCreateCourse = async (formData) => {
    const response = await apiClient.post('/admin/courses', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Lessons
export const adminCreateLesson = async (courseId, formData) => {
    const response = await apiClient.post(`/admin/courses/${courseId}/lessons`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Exams & Grading
export const getPendingExams = async () => {
    const response = await apiClient.get('/admin/exams/pending');
    return response.data;
};

export const gradeTheory = async (submissionId, theoryScore) => {
    const response = await apiClient.patch(`/admin/submissions/${submissionId}/grade`, { theoryScore });
    return response.data;
};

export const approveSubmission = async (submissionId) => {
    const response = await apiClient.post(`/admin/submissions/${submissionId}/approve`);
    return response.data;
};

export const createExam = async (courseId, passPercentage) => {
    const response = await apiClient.post(`/admin/courses/${courseId}/exam`, { passPercentage });
    return response.data;
};

export const addQuestion = async (examId, questionData) => {
    const response = await apiClient.post(`/admin/exams/${examId}/questions`, questionData);
    return response.data;
};

// User Management (Based on existing adminStore needs)
export const getStudents = async () => {
    const response = await apiClient.get('/admin/students'); // Note: Endpoint not explicitly in MAPPING but needed for UI
    return response.data;
};
