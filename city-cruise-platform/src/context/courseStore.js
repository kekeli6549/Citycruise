import { create } from 'zustand';
import { getAllCourses, getCourseById, GetCourseLessons, getMyCourses, markLessonComplete } from '../api/courseService';
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
  userCourseLessons: [],
  categories: [],
  enrolledCourses: [],
  selectedCourse: null,
  progressSummary: [],
  isLoading: false,
  error: null,

  fetchMyCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMyCourses();
      console.log("Raw Backend Response:", data);
      set({ enrolledCourses: data.data || data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },



  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
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

  userFetchCourses: async () => {
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

  fetchCategories: async () => {
    try {
      const data = await adminGetCategories();
      set({ categories: data.data || data });
    } catch (err) {
      console.warn("Categories fetch failed:", err.message);
    }
  },

  fetchCourseLessons: async (id) => {
    try {
      const data = await GetCourseLessons(id);
      set({ userCourseLessons: data.data || data });
    } catch (err) {
      console.warn("Categories fetch failed:", err.message);
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

  toggleStatus: async (id, newStatus) => {
    const previousCourses = get().courses;

    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === id ? { ...c, STATUS: newStatus } : c
      ),
    }));
    try {
      await adminToggleCourseStatus(id, newStatus);
    } catch (err) {
      set({
        courses: previousCourses,
        error: err.message
      });
      alert("Failed to update status on server. Reverting change.");
    }
  },

  completeLesson: async (lessonId, addCompletedLesson) => {
    try {
      await markLessonComplete(lessonId);

      if (addCompletedLesson) {
        addCompletedLesson(lessonId);
      }

      return true;
    } catch (err) {
      console.error("Store error marking lesson complete:", err);
      return false;
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
    } catch (err) {
      throw err;
    }
  }
}));