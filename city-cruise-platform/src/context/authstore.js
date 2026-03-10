import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { registerUser, loginUser } from '../api/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      // Initializing lists to prevent map errors in UI
      purchasedCourses: [],
      completedCourses: [],
      completedLessons: [],
      certificates: [],
      examResults: [],
      activityLog: [],

      signup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await registerUser(formData);
          const userData = response.data?.user || response.data;
          set({ 
            user: userData, 
            isAuthenticated: true, 
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || "Registration failed";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginUser(credentials);
          // Syncing with authService data return
          const userData = response.data?.user || response; 
          set({
            user: userData,
            token: response.data?.token || response.token,
            isAuthenticated: true,
            isLoading: false,           
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || "Invalid credentials";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          purchasedCourses: [],
          completedCourses: [],
          completedLessons: [],
          certificates: [],
          examResults: [],
          activityLog: [],
          error: null
        });
        localStorage.removeItem('city-cruise-auth');
      },

      purchaseCourse: (courseId) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.username || 'User'}`,
          action: "Purchased",
          target: courseId,
          time: "Just now"
        };
        return {
          purchasedCourses: [...new Set([...(state.purchasedCourses || []), courseId])],
          activityLog: [newLog, ...(state.activityLog || [])].slice(0, 50)
        };
      }),

      addCompletedLesson: (lessonId) => set((state) => ({
        completedLessons: [...new Set([...(state.completedLessons || []), lessonId])]
      })),

      completeCourse: (courseId) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName || 'Innovator'}`,
          action: "Completed",
          target: courseId,
          time: "Just now"
        };
        return {
          completedCourses: [...new Set([...(state.completedCourses || []), courseId])],
          activityLog: [newLog, ...(state.activityLog || [])].slice(0, 50)
        };
      }),

      recordExamResult: (courseId, title, passed, score) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName || 'Innovator'}`,
          action: passed ? "Passed Exam" : "Failed Exam",
          target: title,
          time: "Just now"
        };
        const updatedCertificates = passed
          ? [...new Set([...(state.certificates || []), courseId])]
          : state.certificates;
        const newResult = {
          courseId,
          score,
          passed,
          date: new Date().toISOString()
        };
        return {
          certificates: updatedCertificates,
          examResults: [newResult, ...(state.examResults || [])],
          activityLog: [newLog, ...(state.activityLog || [])].slice(0, 50)
        };
      })
    }),
    { name: 'city-cruise-auth' }
  )
);