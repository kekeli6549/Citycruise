import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      purchasedCourses: [], // IDs of courses bought
      completedCourses: [], // IDs of courses finished
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      purchaseCourse: (courseId) => 
        set((state) => ({ 
          purchasedCourses: [...new Set([...state.purchasedCourses, courseId])] 
        })),
      completeCourse: (courseId) => 
        set((state) => ({ 
          completedCourses: [...new Set([...state.completedCourses, courseId])] 
        })),
    }),
    { 
      name: 'city-cruise-auth' 
    }
  )
);