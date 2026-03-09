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

export const adminGetCourses = async () => {
    const response = await apiClient.get('/admin/courses');
    return response.data;
};

export const adminDeleteCourse = async (courseId) => {
    const response = await apiClient.delete(`/admin/courses/${courseId}`);
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

export const adminDeleteLesson = async (lessonId) => {
    const response = await apiClient.delete(`/admin/lessons/${lessonId}`);
    return response.data;
};

export const adminGetCategories = async () => {
    const response = await apiClient.get('/categories');
    return response.data;
};

export const adminCreateCategory = async (name, tag) => {
    const response = await apiClient.post('/admin/categories', { name, tag });
    return response.data;
};

export const adminDeleteCategory = async (categoryId) => {
    const response = await apiClient.delete(`/admin/categories/${categoryId}`);
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

export const adminGetExamDetails = async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/exam`);
    return response.data;
};

export const addQuestion = async (examId, questionData) => {
    const response = await apiClient.post(`/admin/exams/${examId}/questions`, questionData);
    return response.data;
};

export const adminUpdateExam = async (examId, examData) => {
    const response = await apiClient.patch(`/admin/exams/${examId}`, examData);
    return response.data;
};

export const getStudents = async (query = '', limit = 20, offset = 0) => {
    const response = await apiClient.get(`/admin/users?q=${query}&limit=${limit}&offset=${offset}`);
    return response.data;
};

export const adminToggleUserStatus = async (userId, isActive) => {
    const response = await apiClient.patch(`/admin/users/${userId}/status`, { isActive });
    return response.data;
};

export const adminGetStats = async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
};

export const adminGetActivityLogs = async (limit = 50, offset = 0) => {
    const response = await apiClient.get(`/admin/activity-logs?limit=${limit}&offset=${offset}`);
    return response.data;
};

export const adminToggleCourseStatus = async (courseId, status) => {
    const response = await apiClient.patch(`/admin/courses/${courseId}/status`, { status });
    return response.data;
};