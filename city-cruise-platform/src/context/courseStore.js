import { create } from 'zustand';
import { getAllCourses, getCourseById, getMyCourses } from '../api/courseService';
import { 
  adminGetCategories, 
  adminCreateCategory, 
  adminDeleteCategory, 
  adminDeleteCourse, 
  adminToggleCourseStatus,
  adminDeleteLesson,
  adminGetCourses
} from '../api/adminService';

export const useCourseStore = create((set, get) => ({
  courses: [],
  categories: [], // Dynamic Disciplines
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
      // Use admin endpoint for comprehensive list if available
      const data = await adminGetCourses();
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

  // Discipline Management
  fetchCategories: async () => {
    try {
      const data = await adminGetCategories();
      set({ categories: data.data || data }); 
    } catch (err) {
      console.warn("Categories endpoint not found or server error", err.message);
    }
  },

  addCategory: async (name, tag) => {
    try {
      const data = await adminCreateCategory(name, tag);
      const newCat = data.data || data;
      set((state) => ({ categories: [...state.categories, newCat] }));
    } catch (err) {
      throw err;
    }
  },

  removeCategory: async (id) => {
    try {
      await adminDeleteCategory(id);
      set((state) => ({ categories: state.categories.filter(cat => cat.id !== id) }));
    } catch (err) {
      throw err;
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

  toggleStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      await adminToggleCourseStatus(id, status);
      set((state) => ({
        courses: state.courses.map((c) => 
          c.id === id ? { ...c, status: status } : c
        ),
        isLoading: false
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  deleteCourse: async (id) => {
    try {
      await adminDeleteCourse(id);
      set((state) => ({
        courses: state.courses.filter((c) => c.id !== id)
      }));
    } catch (err) {
      throw err;
    }
  },

  deleteLesson: async (lessonId) => {
    try {
      await adminDeleteLesson(lessonId);
      // We don't have a lessons list in the store, but we might need to refresh course details
      // or the component will handle the local state update.
    } catch (err) {
      throw err;
    }
  },

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