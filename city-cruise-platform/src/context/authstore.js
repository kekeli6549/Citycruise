import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      purchasedCourses: [], 
      completedCourses: [], 
      completedLessons: [], 
      certificates: [], 
      examResults: [], 
      activityLog: [], 

      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        purchasedCourses: [],
        completedCourses: [],
        completedLessons: [], 
        certificates: [],
        examResults: [],
        activityLog: []
      }),

      purchaseCourse: (courseId) => set((state) => {
        const newLog = {
          id: Date.now(),
          user: `${state.user?.firstName || 'Innovator'}`,
          action: "Purchased",
          target: courseId,
          time: "Just now"
        };
        return { 
          purchasedCourses: [...new Set([...state.purchasedCourses, courseId])],
          activityLog: [newLog, ...state.activityLog].slice(0, 50)
        };
      }),

      // Syncing name with CoursePlayer usage
      addCompletedLesson: (lessonId) => set((state) => ({
        completedLessons: [...new Set([...state.completedLessons, lessonId])]
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
          completedCourses: [...new Set([...state.completedCourses, courseId])],
          activityLog: [newLog, ...state.activityLog].slice(0, 50)
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