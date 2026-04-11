import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  registerUser, 
  loginUser, 
  updateUserInfo, 
  logoutUser, 
  forgotPassword, 
  resetPassword 
} from '../api/authService';
import { getUserCourseProgress } from '../api/courseService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      purchasedCourses: [],
      completedCourses: [],
      completedLessons: [],
      certificates: [],
      examResults: [],
      activityLog: [],

      setOnlineStatus: (status) => set({ isOnline: status }),

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
          const userData = response.data?.user || response;
          set({
            user: userData,
            token: response.data?.token || response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || err.response?.message || "Invalid credentials (Check your connection)";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      requestPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await forgotPassword(email);
          set({ isLoading: false });
          return { success: true, message: response.message || "Reset link sent to your email" };
        } catch (err) {
          const message = err.response?.data?.message || "Failed to send reset link";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      confirmPasswordReset: async (token, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await resetPassword(token, newPassword);
          set({ isLoading: false });
          return { success: true, message: "Password updated successfully" };
        } catch (err) {
          const message = err.response?.data?.message || "Failed to reset password";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      updateProfile: async (updateData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await updateUserInfo(updateData);
          const updatedUser = response.data || response;
          set((state) => ({
            user: { ...state.user, ...updatedUser },
            isLoading: false,
          }));
          return { success: true, message: "Profile updated" };
        } catch (err) {
          const message = err.response?.data?.message || "Update failed";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutUser();
        } catch (err) {
          console.warn("Server-side logout failed, clearing local state.");
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            purchasedCourses: [],
            completedCourses: [],
            completedLessons: [],
            certificates: [],
            examResults: [],
            activityLog: [],
            error: null,
            isLoading: false
          });
          localStorage.removeItem('city-cruise-auth');
        }
      },

      fetchUserProgress: async (courseId) => {
        try {
          const response = await getUserCourseProgress(courseId);
          set({ completedLessons: response.data || [] });
        } catch (err) {
          console.error("Failed to fetch progress:", err);
        }
      },

      addCompletedLesson: (lessonId) => set((state) => ({
        completedLessons: [...new Set([...(state.completedLessons || []), Number(lessonId)])]
      })),

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
          user: `${state.user?.username || 'Innovator'}`,
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