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

export const adminUpdateCourse = async (courseId, formData) => {
    const response = await apiClient.patch(`/admin/courses/${courseId}`, formData, {
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

export const adminUpdateLesson = async (lessonId, formData) => {
    const response = await apiClient.patch(`/admin/lessons/${lessonId}`, formData, {
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

export const createExam = async (courseId, examData) => {
    const response = await apiClient.post(`/admin/courses/${courseId}/exam`, examData);
    return response.data;
};

export const addQuestion = async (examId, questionData) => {
    const response = await apiClient.post(`/admin/exams/${examId}/questions`, questionData);
    return response.data;
};

export const getStudents = async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
};