import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Ensure the name here is exactly 'useAuthStore'
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { 
      name: 'city-cruise-auth' 
    }
  )
);