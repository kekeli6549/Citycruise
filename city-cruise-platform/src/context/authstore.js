import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      purchasedCourses: [],
      completedCourses: [],
      certificates: [], // Stores passed exam IDs
      examResults: [], // NEW: Detailed history of student scores
      activityLog: [],

      signup: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await registerUser(formData);
          set({ user: data, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          console.error("Full API Error Object:", err);
          console.error("Server Response Data:", err.response?.data);

          const message = err.response?.data?.message || "Registration failed";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      login: (userData) => set({
        user: userData,
        isAuthenticated: true
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        purchasedCourses: [],
        completedCourses: [],
        certificates: [],
        examResults: [],
        activityLog: []
      }),

      purchaseCourse: (courseId) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName || 'User'}`,
          action: "Purchased",
          target: courseId,
          time: "Just now"
        };
        return {
          purchasedCourses: [...new Set([...state.purchasedCourses, courseId])],
          activityLog: [newLog, ...state.activityLog].slice(0, 50)
        };
      }),

      completeCourse: (courseId) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName || 'User'}`,
          action: "Completed",
          target: courseId,
          time: "Just now"
        };
        return {
          completedCourses: [...new Set([...state.completedCourses, courseId])],
          activityLog: [newLog, ...state.activityLog].slice(0, 50)
        };
      }),

      recordExamResult: (courseId, title, passed, score) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName || 'User'}`,
          action: passed ? "Passed Exam" : "Failed Exam",
          target: title,
          time: "Just now"
        };

        const updatedCertificates = passed
          ? [...new Set([...state.certificates, courseId])]
          : state.certificates;

        const newResult = {
          courseId,
          score,
          passed,
          date: new Date().toISOString()
        };

        return {
          certificates: updatedCertificates,
          examResults: [newResult, ...state.examResults],
          activityLog: [newLog, ...state.activityLog].slice(0, 50)
        };
      })
    }),
    { name: 'city-cruise-auth' }
  )
);