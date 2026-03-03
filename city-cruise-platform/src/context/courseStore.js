import { create } from 'zustand';
import { coursesData as initialData } from '../data/coursesData';

export const useCourseStore = create((set) => ({
  courses: initialData.map(c => ({
    ...c,
    progress: c.progress || 0,
    examStatus: c.examStatus || 'not_started',
    students: c.students || Math.floor(Math.random() * 500) + 100,
    status: c.status || 'Published',
    submissions: c.submissions || [] 
  })),

  updateCourse: (id, updates) => set((state) => ({
    courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })),

  toggleStatus: (id) => set((state) => ({
    courses: state.courses.map((c) => 
      c.id === id ? { ...c, status: c.status === 'Published' ? 'Draft' : 'Published' } : c
    ),
  })),

  addCourse: (newCourse) => set((state) => ({
    courses: [...state.courses, { ...newCourse, id: `course-${Date.now()}`, students: 0, status: 'Draft', submissions: [] }]
  })),

  submitExamToAdmin: (courseId, submissionData) => set((state) => ({
    courses: state.courses.map((c) => 
      c.id === courseId 
        ? { ...c, submissions: [{ ...submissionData, id: `sub-${Date.now()}` }, ...(c.submissions || [])] } 
        : c
    ),
  })),

  updateSubmissionStatus: (courseId, submissionId, updates) => set((state) => ({
    courses: state.courses.map((c) => 
      c.id === courseId 
        ? { 
            ...c, 
            submissions: c.submissions.map(s => s.id === submissionId ? { ...s, ...updates } : s) 
          } 
        : c
    ),
  })),
}));