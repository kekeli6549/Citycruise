import { create } from 'zustand';
import { getAllCourses, getCourseById, getMyCourses } from '../api/courseService';

export const useCourseStore = create((set) => ({
  courses: [],
  enrolledCourses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,

  fetchMyCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMyCourses();
      set({ enrolledCourses: data.data || data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getAllCourses();
      set({ 
        courses: (data.data || data).map(c => ({
          ...c,
          progress: c.progress || 0,
          examStatus: c.examStatus || 'not_started',
          students: c.students || 0,
          status: c.status || 'Published',
          submissions: c.submissions || [] 
        })),
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchCourseDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCourseById(id);
      const course = data.data || data;
      set({ selectedCourse: course, isLoading: false });
      return course;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

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
            submissions: (c.submissions || []).map(s => s.id === submissionId ? { ...s, ...updates } : s) 
          } 
        : c
    ),
  })),
}));