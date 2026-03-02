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
      activityLog: [], // The "Live Ecosystem" feed

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
        activityLog: []
      }),

      purchaseCourse: (courseId) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName} ${state.user?.lastName}`,
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
          user: `${state.user?.firstName} ${state.user?.lastName}`,
          action: "Completed",
          target: courseId,
          time: "Just now"
        };
        return { 
          completedCourses: [...new Set([...state.completedCourses, courseId])],
          activityLog: [newLog, ...state.activityLog].slice(0, 50)
        };
      }),

      // New: Record Exam Results
      recordExamResult: (courseId, title, passed, score) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName} ${state.user?.lastName}`,
          action: passed ? "Passed Exam" : "Failed Exam",
          target: title,
          time: "Just now"
        };
        
        const updatedCertificates = passed 
          ? [...new Set([...state.certificates, courseId])] 
          : state.certificates;

        return {
          certificates: updatedCertificates,
          activityLog: [newLog, ...state.activityLog].slice(0, 50)
        };
      })
    }),
    { name: 'city-cruise-auth' }
  )
);